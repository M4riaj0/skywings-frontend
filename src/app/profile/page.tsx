'use client';

import React, { use, useState } from "react";
import { Stack, Typography } from "@mui/material";
import Stepper from "@/components/stepper";
import MultiStepForm from "@/components/forms/mutliStepFrom";

const steps = ["Usuario", "Personal", "Dirección", "Nacimiento"];

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getUser = async () => {
  console.log("Getting user data");
  const token = localStorage.getItem("token");
  let username;
  console.log(token);
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
    console.log(username);
  }
  try {
    const response = await fetch(`${backendUrl}/users/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const Profile = () => {
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

  const userData = getUser();

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Typography variant="h4" component="h1" align="center">
        Editar información de Perfil
      </Typography>

      {/* Stepper visual */}
      <Stepper steps={steps} currentStep={step + 1} />

      {/* MultiStepForm pasa el control de los pasos y el manejo de datos */}
      <MultiStepForm step={step} nextStep={nextStep} prevStep={prevStep} user={userData} />
    </Stack>
  );
};

export default Profile;
