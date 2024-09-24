"use client";

import React from "react";
import { z } from "zod";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Stack, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { userSchema } from "@/schemas/userInfo";



interface AdditionalInfoProps {
  onBack: () => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ onBack }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<z.infer<typeof userSchema>>();

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <div>
        <Controller
          name="dni"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="DNI"
              variant="outlined"
              error={!!errors.dni}
              helperText={errors.dni ? errors.dni.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Dirección"
              variant="outlined"
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="birthplace"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Lugar de Nacimiento"
              variant="outlined"
              error={!!errors.birthplace}
              helperText={errors.birthplace ? errors.birthplace.message : ""}
              fullWidth
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel id="gender-label">Género</InputLabel>
              <Select
                {...field}
                labelId="gender-label"
                label="Género"
                defaultValue="" // Asegura un valor inicial
              >
                <MenuItem value="">
                  <em>Selecciona un género</em>
                </MenuItem>
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
              <FormHelperText>
                {errors.gender ? errors.gender.message : ""}
              </FormHelperText>
            </FormControl>
          )}
        />
      </div>
    </Stack>
  );
};

export default AdditionalInfo;
