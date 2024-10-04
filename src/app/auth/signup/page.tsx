'use client';

import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import Stepper from "@/components/stepper";
import MultiStepForm from "@/components/forms/mutliStepFrom";

const steps = ["Usuario", "Personal", "Dirección", "Nacimiento"];

const Signup = () => {
  const [step, setStep] = useState(0);

  // Funciones para manejar el avance y retroceso entre los pasos
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Typography variant="h4" component="h1" align="center">
        Registro
      </Typography>

      {/* Stepper visual */}
      <Stepper steps={steps} currentStep={step + 1} />

      {/* MultiStepForm pasa el control de los pasos y el manejo de datos */}
      <MultiStepForm step={step} nextStep={nextStep} prevStep={prevStep} />
    </Stack>
  );
};

export default Signup;
