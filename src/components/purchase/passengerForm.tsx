import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { TextField, Typography, Button, Box, Grid2 } from "@mui/material";
import { IPassenger, ITicket } from "@/app/schemas/cartSchemas";

const passengerSchema = z.object({
  dni: z
    .string()
    .min(6, "DNI inválido")
    .max(16, "DNI inválido")
    .regex(/^\d+$/, "El DNI solo debe contener números"),
  name1: z
    .string()
    .min(3, "Nombre es requerido")
    .regex(/^\S+$/, "El nombre no debe contener espacios en blanco"),
  name2: z
    .string()
    .optional(),
  surname1: z
    .string()
    .min(3, "Apellido es requerido")
    .regex(/^\S+$/, "El apellido no debe contener espacios en blanco"),
  surname2: z
    .string()
    .optional(),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "El teléfono solo debe contener números"),
  birthDate: z.string().refine((val) => {
    const birthDate = new Date(val);
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const ninetyYearsAgo = new Date(
      today.getFullYear() - 90,
      today.getMonth(),
      today.getDate()
    );
    return (
      birthDate <= eighteenYearsAgo &&
      birthDate >= ninetyYearsAgo &&
      birthDate <= today
    );
  }, "Debes tener entre 18 y 90 años, y la fecha de nacimiento no puede estar en el futuro"),
});

const PassengerForm: React.FC<{
  ticket: ITicket;
  handleSubmit: (data: IPassenger) => void;
}> = ({ticket, handleSubmit }) => {
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<IPassenger>({
    resolver: zodResolver(passengerSchema),
  });

  const onSubmit = (data: IPassenger) => {
    handleSubmit(data);
  };

  return (
    <form onSubmit={handleFormSubmit(onSubmit)} className="border rounded-lg shadow-md my-4 py-6">
      <Box className='flex justify-between items-center w-[85%] mb-4 mx-auto'>
        <Typography variant="h5" className="my-3">
          Datos del pasajero
        </Typography>
        <Typography variant="h6" className="my-3">
          {ticket.class == 'Primera' ? 'Primera Clase' : 'Clase Económica'}
        </Typography>
        <Typography variant="h6" className="my-3">
          $ {ticket.price}
        </Typography>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </Box>
      <Grid2 container spacing={3} columns={4} justifyContent="center" alignItems="center">
        <Grid2 className="w-56">
          <Controller
            name="dni"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="DNI"
                variant="outlined"
                fullWidth
                error={!!errors.dni}
                helperText={errors.dni ? errors.dni.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="name1"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Primer Nombre"
                variant="outlined"
                fullWidth
                error={!!errors.name1}
                helperText={errors.name1 ? errors.name1.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="name2"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Segundo Nombre"
                variant="outlined"
                fullWidth
                error={!!errors.name2}
                helperText={errors.name2 ? errors.name2.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="surname1"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Primer Apellido"
                variant="outlined"
                fullWidth
                error={!!errors.surname1}
                helperText={errors.surname1 ? errors.surname1.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="surname2"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Segundo Apellido"
                variant="outlined"
                fullWidth
                error={!!errors.surname2}
                helperText={errors.surname2 ? errors.surname2.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Celular"
                variant="outlined"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
              />
            )}
          />
        </Grid2>
        <Grid2 className="w-56">
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de nacimiento"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthDate}
                helperText={errors.birthDate ? errors.birthDate.message : ""}
              />
            )}
          />
        </Grid2>
      </Grid2>
    </form>
  );
};

export default PassengerForm;
