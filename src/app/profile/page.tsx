'use client';

import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import MultiStepForm from "@/components/forms/mutliStepFrom";
import { getUser } from '@/services/profile'

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const getUserData = async () => {
    const data = await getUser();
    setUserData(data);
  }

  useEffect(() => {
    getUserData();
  }, []);

  console.log(userData);
  const steps = ["Usuario", "Personal", "Dirección", "Nacimiento"];

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Typography variant="h4" component="h1" align="center">
        Editar información de Perfil
      </Typography>

      {/* Stepper visual */}
      {/* <Stepper steps={steps} currentStep={step + 1} /> */}

      {/* MultiStepForm pasa el control de los pasos y el manejo de datos */}
      <MultiStepForm steps={steps} user={userData} />
    </Stack>
  );
};

export default Profile;
