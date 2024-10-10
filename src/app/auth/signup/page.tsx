'use client';

import { Stack, Typography } from "@mui/material";
import MultiStepForm from "@/components/forms/mutliStepFrom";


const Signup = () => {
  const steps = ["Usuario", "Personal", "Dirección", "Nacimiento"];

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Typography variant="h4" component="h1" align="center">
        Registro
      </Typography>

      {/* MultiStepForm pasa el control de los pasos y el manejo de datos */}
      <MultiStepForm steps={steps} user={undefined} />
    </Stack>
  );
};

export default Signup;
