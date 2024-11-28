"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import {
  flightFormSchema,
  ReceivingData,
} from "@/schemas/flightFormSchema";
import type {
  FlightForm,
  CitiesSchema,
  FlightData,
} from "@/schemas/flightFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers/";
import { createFlight, getFlightsRoute } from "@/services/flights";
import { getCities, formatDateAndTime } from '@/services/cities';

function FlightForm() {
  const theme = useTheme();
  const [nationalCities, setNationalCities] = useState<CitiesSchema>([]);
  const [internationalCities, setInternationalCities] = useState<CitiesSchema>(
    []
  );
  const [destinationCities, setDestinationCities] = useState<CitiesSchema>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [flights, setFlights] = useState<Partial<FlightData>[]>([]);
  const [flightExists, setFlightExists] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FlightForm>({
    defaultValues: {
      type: "",
      origin: "",
      destination: "",
      priceFirstClass: 0,
      priceEconomyClass: 0,
      departure: {
        date: "",
        time: "",
      },
    },
    resolver: zodResolver(flightFormSchema),
  });

  const setCities = async (type: string) => {
    if (type === "national") {
      const cities: ReceivingData = await getCities(type);
      setNationalCities(cities.capitals || []);
    } else if (type === "international") {
      const cities = await getCities(type);
      if ("colombia" in cities) setNationalCities(cities.colombia);
      if ("international" in cities)
        setInternationalCities(cities.international);
    } else if (internationalCities.length > 0) {
      if (nationalCities.some((city) => city.city === type))
        setDestinationCities(internationalCities);
      else if (internationalCities.some((city) => city.city === type))
        setDestinationCities(nationalCities);
    } else if (nationalCities.some((city) => city.city === type)) {
      const filteredCities = nationalCities.filter(
        (city) => city.city !== type
      );
      setDestinationCities(filteredCities);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const departureCode =
      nationalCities.find((city) => city.city === data.origin)?.code ||
      internationalCities.find((city) => city.city === data.origin)?.code;
    const destinationCode = destinationCities.find(
      (city) => city.city === data.destination
    )?.code;
    data.origin = departureCode || "";
    data.destination = destinationCode || "";
    const res = await createFlight(data);
    if (res?.statusCode === 500) {
      setErrorMessage(res.message);
      setSuccess("");
      reset();
    } else if (res?.creator) {
      setSuccess("Vuelo creado exitosamente");
      setErrorMessage("");
      reset();
    } else {
      setErrorMessage("Error inesperado al crear el vuelo");
      setSuccess("");
      reset();
    }
  });

  const searchSameRoute = async () => {
    const res = await getFlightsRoute(
      getValues("origin"),
      getValues("destination")
    );
    if (res && !res.statusCode) {
      setFlights(res);
    }
  };

  const matchingFlight = () => {
    if (flights && flights.length > 0) {
      const flightExists = flights.find(
        (flight) =>
          flight.origin === getValues("origin") &&
          flight.destination === getValues("destination")
      );
      const { date, time } = formatDateAndTime(
        flightExists?.origin || "",
        flightExists?.departureDate1 || ""
      );
      console.log(date, time, getValues("departure.date"), getValues("departure.time"));
      if (
        flightExists &&
        date === getValues("departure.date") &&
        time === getValues("departure.time")
      ) {
        setErrorMessage("Ya existe un vuelo a la misma fecha y hora");
        setSuccess("");
        setFlightExists(true);
      } else {
        setErrorMessage("");
        setFlightExists(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 my-4 ">
      <Typography
        variant="h4"
        component="h1"
        align="center"
        className="text-bold"
      >
        Crear vuelo
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            className="w-full sm:w-1/3 sm:pr-2"
            label="Tipo de vuelo"
            variant="outlined"
            value={field.value || ""}
            error={!!errors.type}
            helperText={errors.type?.message}
            onChange={(e) => {
              setDestinationCities([]);
              setNationalCities([]);
              setInternationalCities([]);
              setValue("origin", "");
              setValue("destination", "");
              field.onChange(e);
              setCities(e.target.value);
            }}
          >
            <MenuItem value="national">Nacional</MenuItem>
            <MenuItem value="international">Internacional</MenuItem>
          </TextField>
        )}
      />
      <div id="flightInfo" className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={[...nationalCities, ...internationalCities]}
              getOptionLabel={(option) => option.city}
              noOptionsText="No hay opciones"
              value={
                nationalCities
                  .concat(internationalCities)
                  .find((city) => city.city === field.value) || null
              }
              onChange={(event, value) => {
                field.onChange(value?.city || "");
                setCities(value?.city || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Origen"
                  variant="outlined"
                  error={!!errors.origin}
                  helperText={errors.origin?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={destinationCities}
              getOptionLabel={(option) => option.city}
              noOptionsText="No hay opciones"
              value={
                destinationCities.find((city) => city.city === field.value) ||
                null
              }
              onChange={async (event, value) => {
                field.onChange(value?.city || "");
                searchSameRoute();
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destino"
                  variant="outlined"
                  error={!!errors.destination}
                  helperText={errors.destination?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="departure.date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de salida"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
                max: new Date(new Date().setDate(new Date().getDate() + 365))
                  .toISOString()
                  .split("T")[0],
              }}
              error={!!errors.departure?.date}
              helperText={errors.departure?.date?.message}
            />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col">
            <Controller
              name="departure.time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Hora de salida"
                  ampm={false}
                  value={field.value ? dayjs(field.value, "HH:mm") : null}
                  onChange={(date) => {
                    field.onChange(date?.format("HH:mm"));
                    matchingFlight();
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: errors.departure?.time ? "red" : "",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.departure?.time ? "red" : "",
                    },
                    "& .MuiInputLabel-root": {
                      color: errors.departure?.time ? "red" : "",
                    },
                    "& .MuiInputBase-root": {
                      color: errors.departure?.time ? "red" : "",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.departure?.time ? "red" : "",
                    },
                    "& .MuiInputBase-root.Mui-focused": {
                      color: errors.departure?.time ? "red" : "",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: errors.departure?.time ? "red" : "",
                    },
                  }}
                />
              )}
            />
            <Typography color="error" variant="caption" className="mx-3">
              {errors.departure?.time ? errors.departure?.time?.message : ""}
            </Typography>
          </div>
        </LocalizationProvider>
        <Controller
          name="priceFirstClass"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Precio primera clase"
              type="number"
              variant="outlined"
              onChange={(e) =>
                field.onChange(e.target.value ? parseInt(e.target.value) : "")
              }
              error={
                !!errors.priceEconomyClass || field.value.toString() === ""
              }
              helperText={
                field.value.toString() == ""
                  ? "Se requiere un precio válido"
                  : errors.priceEconomyClass?.message
              }
            />
          )}
        />
        <Controller
          name="priceEconomyClass"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Precio clase económica"
              type="number"
              variant="outlined"
              onChange={(e) =>
                field.onChange(e.target.value ? parseInt(e.target.value) : "")
              }
              error={
                !!errors.priceEconomyClass || field.value.toString() === ""
              }
              helperText={
                field.value.toString() == ""
                  ? "Se requiere un precio válido"
                  : errors.priceEconomyClass?.message
              }
            />
          )}
        />
      </div>
      <div className="flex justify-between">
        <Link href="/flights">
          <button
            className="px-4 py-2 text-white rounded shadow-lg"
            style={{ backgroundColor: theme.palette.primary.light }}
          >
            Atrás
          </button>
        </Link>
        <button
          type="submit"
          disabled={flightExists}
          className="px-4 py-2 text-white rounded shadow-lg"
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          Crear Vuelo
        </button>
      </div>
    </form>
  );
}

export default FlightForm;
