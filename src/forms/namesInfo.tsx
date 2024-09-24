"use client";

import React from "react";
import { z } from "zod";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack } from "@mui/material";
import { userSchema } from "@/schemas/userInfo";

interface NamesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const NamesForm: React.FC<NamesFormProps> = ({ onNext, onBack }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof userSchema>>();

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <div>
        <Controller
          name="name1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre 1"
              variant="outlined"
              error={!!errors.name1}
              helperText={errors.name1 ? errors.name1.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="name2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre 2"
              variant="outlined"
              error={!!errors.name2}
              helperText={errors.name2 ? errors.name2.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="surname1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Apellido 1"
              variant="outlined"
              error={!!errors.surname1}
              helperText={errors.surname1 ? errors.surname1.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="surname2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Apellido 2"
              variant="outlined"
              error={!!errors.surname2}
              helperText={errors.surname2 ? errors.surname2.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outlined" onClick={onBack}>
          Atrás
        </Button>
        <Button variant="contained" onClick={onNext}>Siguiente</Button>
      </div>
    </Stack>
  );
};

export default NamesForm;
