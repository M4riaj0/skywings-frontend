import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, TextField, Stack  } from "@mui/material";
import { userSchema } from "@/schemas/userInfo";
import { z } from "zod";

interface MainFormProps {
  onNext: () => void;
}

const MainForm: React.FC<MainFormProps> = ({ onNext }) => {
  const { register, formState: { errors } }  = useFormContext<z.infer<typeof userSchema>>();

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <TextField
        {...register("username")}
        label="Nombre de usuario"
        variant="outlined"
        error={!!errors.username}
        helperText={typeof errors.username?.message === 'string' ? errors.username?.message : ''}
        fullWidth
      />
      <TextField
        {...register("email")}
        label="Email"
        variant="outlined"
        error={!!errors.email}
        helperText={typeof errors.email?.message === 'string' ? errors.email?.message : ''}
        fullWidth
      />
      <TextField
        {...register("password")}
        label="Contraseña"
        variant="outlined"
        type="password"
        error={!!errors.password}
        helperText={typeof errors.password?.message === 'string' ? errors.password?.message : ''}
        fullWidth
      />
      <TextField
        {...register("confirmPassword")}
        label="Confirmar Contraseña"
        variant="outlined"
        type="password"
        error={!!errors.confirmPassword}
        helperText={typeof errors.confirmPassword?.message === 'string' ? errors.confirmPassword?.message : ''}
        fullWidth
      />
      <Button variant="contained" onClick={onNext}>Siguiente</Button>
      </Stack>
  );
};

export default MainForm;
