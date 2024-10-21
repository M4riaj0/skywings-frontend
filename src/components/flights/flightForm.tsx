"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { flightFormSchema } from "./flightFormSchema";
import type { FlightForm } from "./flightFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getLocations } from "@/services/flights";

function FlightForm() {
  const theme = useTheme();
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FlightForm>({
    resolver: zodResolver(flightFormSchema),
  });

  const getCities = async (e) => {
    const type = e.target.value;
    console.log(type);
    const cities = await getLocations(type);
    console.log(cities);
    if (type === "national") {
      setDepartureCities(cities.capitals);
      setArrivalCities(cities.capitals);
    } else {
      setDepartureCities(cities.origin);
      setArrivalCities(cities.destination);
    }
  };

  // const onSubmit = handleSubmit(async (data) => {
  //   console.log(data);
  // });

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="space-y-6 my-4"
    >
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
            className="w-full sm:w-1/2 sm:pr-2"
            label="Tipo de vuelo"
            variant="outlined"
            value={field.value || ""}
            error={!!errors.origin}
            helperText={errors.origin?.message}
            onChange={(e) => {
              field.onChange(e);
              getCities(e);
            }}
          >
            <MenuItem value="national">Nacional</MenuItem>
            <MenuItem value="international">Internacional</MenuItem>
          </TextField>
        )}
      />
      <div
        id="flightInfo"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
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
            >
              {departureCities.length > 0 ? (
                departureCities.map((city) => (
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
              {arrivalCities.length > 0 ? (
                arrivalCities.map((city) => (
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
          name="priceFirstClass"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Precio primera clase"
              type="number"
              variant="outlined"
              error={!!errors.priceFirstClass}
              helperText={errors.priceFirstClass?.message}
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
              error={!!errors.priceEconomyClass}
              helperText={errors.priceEconomyClass?.message}
            />
          )}
        />
      </div>
      <div
        id="departure1"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Controller
          name="departure1.date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de salida ida"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.departure1?.date}
              helperText={errors.departure1?.date?.message}
            />
          )}
        />
        <Controller
          name="departure1.time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hora de salida ida"
              type="time"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.departure1?.time}
              helperText={errors.departure1?.time?.message}
            />
          )}
        />
        <Controller
          name="arrival1.date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de llegada ida"
              type="date"
              variant="outlined"
              fullWidth
              disabled={watch("type") === "national"}
              InputLabelProps={{ shrink: true }}
              error={!!errors.arrival1?.date}
              helperText={errors.arrival1?.date?.message}
            />
          )}
        />
        <Controller
          name="arrival1.time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hora de llegada ida"
              type="time"
              variant="outlined"
              fullWidth
              disabled={watch("type") === "national"}
              InputLabelProps={{ shrink: true }}
              error={!!errors.arrival1?.time}
              helperText={errors.arrival1?.time?.message}
            />
          )}
        />
      </div>
      <div
        id="departure2"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Controller
          name="departure2.date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de salida vuelta"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.departure2?.date}
              helperText={errors.departure2?.date?.message}
            />
          )}
        />
        <Controller
          name="departure2.time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hora de salida vuelta"
              type="time"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.departure2?.time}
              helperText={errors.departure2?.time?.message}
            />
          )}
        />
        <Controller
          name="arrival2.date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de llegada ida"
              type="date"
              variant="outlined"
              fullWidth
              disabled={watch("type") === "national"}
              InputLabelProps={{ shrink: true }}
              error={!!errors.arrival2?.date}
              helperText={errors.arrival2?.date?.message}
            />
          )}
        />
        <Controller
          name="arrival2.time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hora de llegada ida"
              type="time"
              variant="outlined"
              fullWidth
              disabled={watch("type") === "national"}
              InputLabelProps={{ shrink: true }}
              error={!!errors.arrival2?.time}
              helperText={errors.arrival2?.time?.message}
            />
          )}
        />
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 text-white rounded"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        Crear Vuelo
      </button>
    </form>
  );
}

export default FlightForm;
