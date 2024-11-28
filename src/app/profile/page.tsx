'use client';

import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import MultiStepForm from "@/components/forms/mutliStepFrom";
import { getUser } from '@/services/profile'
import { RegisterData } from "@/schemas/users";

const Profile = () => {
  const [userData, setUserData] = useState<RegisterData | null>(null);
  const getUserData = async () => {
    const data = await getUser();
    setUserData(data);
  }

  useEffect(() => {
    getUserData();
  }, []);

  const steps = ["Usuario", "Personal", "Dirección", "Nacimiento"];

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Typography variant="h4" component="h1" align="center">
        Editar información de Perfil
      </Typography>

      {/* MultiStepForm pasa el control de los pasos y el manejo de datos */}
      <MultiStepForm steps={steps} user={userData} />
    </Stack>
  );
};

export default Profile;
