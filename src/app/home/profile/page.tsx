"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Stack, Typography } from "@mui/material";
import Stepper from "@/components/Stepper";
import UserSettingsForm from "@/context/UserSettingsForm";
// import SecurityForm from "@/forms/securityInfo";
// import PreferencesForm from "@/forms/preferencesInfo";

const steps = ["Información de Usuario", "Seguridad", "Preferencias"];

const UserSettings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<FormData>();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

interface FormData {
    // Define the structure of your form data here
    // Example:
    username: string;
    password: string;
    preferences: {
        theme: string;
        notifications: boolean;
    };
}

const onSubmit = async (data: FormData) => {
    console.log("Configuración de usuario actualizada:", data);
    // Aquí manejarías el envío de los datos actualizados al backend
};

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4" component="h1" align="center">
          Configuración del Usuario
        </Typography>
        <Stepper steps={steps} currentStep={currentStep + 1} />

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Formulario para Información de Usuario */}
          {currentStep === 0 && <UserSettingsForm onNext={handleNext} />}
          
          {/* Formulario para Seguridad */}
          {currentStep === 1 && <UserSettingsForm onNext={handleNext} onBack={handleBack} />}
          
          {/* Formulario para Preferencias */}
          {currentStep === 2 && <UserSettingsForm onBack={handleBack} />}
          
          {/* Botones de "Guardar" y "Atrás" visibles en el último paso */}
          {currentStep === 2 && (
            <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleBack}>
                Atrás
              </Button>
              <Button type="submit" variant="contained">
                Guardar Cambios
              </Button>
            </Stack>
          )}
        </form>
      </Stack>
    </FormProvider>
  );
};

export default UserSettings;
