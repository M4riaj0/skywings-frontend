"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import {
  flightFormSchema,
  ReceivingData,
} from "@/app/schemas/flightFormSchema";
import type { FlightForm, CitiesSchema } from "@/app/schemas/flightFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Typography, MenuItem, Autocomplete, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createFlight, getLocations } from "@/services/flights";

function FlightForm() {
  const theme = useTheme();
  const [nationalCities, setNationalCities] = useState<CitiesSchema>([]);
  const [internationalCities, setInternationalCities] = useState<CitiesSchema>(
    []
  );
  const [destinationCities, setDestinationCities] = useState<CitiesSchema>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");

  const {
    handleSubmit,
    control,
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

  const getCities = async (type: string) => {
    if (type === "national") {
      const cities: ReceivingData = await getLocations(type);
      setNationalCities(cities.capitals || []);
    } else if (type === "international") {
      const cities = await getLocations(type);
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
    console.log(res);
    if (res.statusCode === 500) {
      console.log("Error");
      setErrorMessage(res.message);
      setSuccess("");
    } else {
      console.log("Success");
      setSuccess("Vuelo creado exitosamente");
      setErrorMessage("");
      reset();
    }
  });

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
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {success && (
        <Alert severity="success">{success}</Alert>
      )}
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
              getCities(e.target.value);
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
              onChange={(event, value) => {
                field.onChange(value?.city || "");
                getCities(value?.city || "");
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
              onChange={(event, value) => {
                field.onChange(value?.city || "");
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
              error={!!errors.departure?.date}
              helperText={errors.departure?.date?.message}
            />
          )}
        />
        <Controller
          name="departure.time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hora de salida"
              type="time"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.departure?.time}
              helperText={errors.departure?.time?.message}
            />
          )}
        />
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
                field.onChange(e.target.value ? Number(e.target.value) : "")
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
                field.onChange(e.target.value ? Number(e.target.value) : "")
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
