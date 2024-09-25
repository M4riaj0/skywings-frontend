import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, Stack, TextField } from "@mui/material";

interface UserSettingsFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ onNext }) => {
  const { register } = useFormContext();

  return (
    <Stack spacing={2}>
      <TextField label="Nombre de Usuario" {...register("username")} />
      <TextField label="Email" {...register("email")} />
      
      <Button variant="contained" onClick={onNext}>
        Siguiente
      </Button>
    </Stack>
  );
};

export default UserSettingsForm;
