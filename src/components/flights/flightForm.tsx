"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { flightFormSchema, ReceivingData } from "./flightFormSchema";
import type { FlightForm, CitiesSchema } from "./flightFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Typography, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createFlight, getLocations } from "@/services/flights";

function FlightForm() {
  const theme = useTheme();
  const [nationalCities, setNationalCities] = useState<CitiesSchema>([]);
  const [internationalCities, setInternationalCities] = useState<CitiesSchema>(
    []
  );
  const [destinationCities, setDestinationCities] = useState<CitiesSchema>([]);

  const {
    handleSubmit,
    control,
    setValue,
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
    createFlight(data);
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
        <TextField
          {...field}
          select
          label="Origen"
          variant="outlined"
          value={field.value || ""}
          error={!!errors.origin}
          helperText={errors.origin?.message}
          onChange={(e) => {
            field.onChange(e);
            getCities(e.target.value);
          }}
        >
          {nationalCities.length > 0 && internationalCities.length > 0 ? (
            [
          ...nationalCities.map((city) => (
            <MenuItem key={city.code} value={city.city}>
              {city.city}
            </MenuItem>
          )),
          ...internationalCities.map((city) => (
            <MenuItem key={city.code} value={city.city}>
              {city.city}
            </MenuItem>
          )),
            ]
          ) : nationalCities.length > 0 ? (
            nationalCities.map((city) => (
          <MenuItem key={city.code} value={city.city}>
            {city.city}
          </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Cargando ciudades...</MenuItem>
          )}
        </TextField>
          )}
        />
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
        <TextField
          {...field}
          select
          label="Destino"
          variant="outlined"
          value={field.value || ""}
          error={!!errors.destination}
          helperText={errors.destination?.message}
        >
          {destinationCities.length > 0 ? (
            destinationCities.map((city) => (
          <MenuItem key={city.city} value={city.city}>
            {city.city}
          </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Cargando ciudades...</MenuItem>
          )}
        </TextField>
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
          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
          error={!!errors.priceEconomyClass || field.value.toString() === ''}
          helperText={field.value.toString() == '' ? 'Se requiere un precio válido' : errors.priceEconomyClass?.message}
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
          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
          error={!!errors.priceEconomyClass || field.value.toString() === ''}
          helperText={field.value.toString() == '' ? 'Se requiere un precio válido' : errors.priceEconomyClass?.message}
        />
          )}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 text-white rounded shadow-lg"
          style={{ backgroundColor: theme.palette.primary.light }}
        >
          Atrás
        </button>
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
