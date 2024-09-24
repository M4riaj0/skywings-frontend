"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Stack, Typography } from "@mui/material";
import Stepper from "@/components/Stepper";
import MainForm from "@/forms/userInfo";
import NamesForm from "@/forms/namesInfo";
import AdditionalInfo from "@/forms/additionalInfo";

const steps = ["Paso 1", "Paso 2", "Paso 3"];

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    console.log("Datos registrados:", data);
    // Aquí manejarías el envío de datos al backend
  };

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4" component="h1" align="center">
          Registro
        </Typography>
        <Stepper steps={steps} currentStep={currentStep + 1} />

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 0 && <MainForm onNext={handleNext} />}
          {currentStep === 1 && <NamesForm onNext={handleNext} onBack={handleBack} />}
          {currentStep === 2 && <AdditionalInfo onBack={handleBack} />}
          
          {/* Botón de "Registrarse" visible solo en el último paso */}
          {currentStep === 2 && (
            <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleBack}>
                Atrás
              </Button>
              <Button type="submit" variant="contained">
                Registrarse
              </Button>
            </Stack>
          )}
        </form>
      </Stack>
    </FormProvider>
  );
};

export default Signup;
