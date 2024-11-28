import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { TextField, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { IPassenger, ITicket } from "@/schemas/cartSchemas";

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
  name2: z.string().optional(),
  surname1: z
    .string()
    .min(3, "Apellido es requerido")
    .regex(/^\S+$/, "El apellido no debe contener espacios en blanco"),
  surname2: z.string().optional(),
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
  gender: z.string().min(1, "Género es requerido"),
  contactName: z.string().min(3, "Nombre de contacto es requerido"),
  contactPhone: z
    .string()
    .min(10, "El teléfono de contacto debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "El teléfono de contacto solo debe contener números"),
});

const PassengerForm: React.FC<{
  ticket: ITicket;
  handleSubmit: (data: IPassenger) => void;
  shouldRefresh: boolean;
}> = ({ ticket, handleSubmit, shouldRefresh }) => {
  const {
    control,
    setValue,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<IPassenger>({
    defaultValues: ticket.passenger,
    resolver: zodResolver(passengerSchema),
  });

  const onSubmit = (data: IPassenger) => {
    handleSubmit(data);
  };

  if (shouldRefresh) {
    if (ticket.passenger) {
      Object.keys(ticket.passenger).forEach((key) => {
        setValue(
          key as keyof IPassenger,
          ticket.passenger![key as keyof IPassenger]
        );
      });
    }
  }

  return (
    <Card className="my-4">
      <CardContent>
        <Grid container spacing={3}>
          {/* Precio y clase en la misma fila */}
          <Grid item xs={12} sm={6} className="flex items-center">
            <Typography variant="h5" className="font-bold text-gray-800">
              {ticket.class === "First" ? "Primera Clase" : "Clase Económica"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="flex justify-end">
            <div className="bg-gray-200 px-6 py-4 rounded-lg text-center">
              <Typography variant="body2" className="text-gray-500 text-sm">
                Precio
              </Typography>
              <Typography variant="h6" className="font-bold text-gray-800">
                {ticket.price.toLocaleString()} COP
              </Typography>
            </div>
          </Grid>
        </Grid>

        {/* Título de Datos del pasajero con estilo */}
        <Typography variant="h5" className="my-6 font-semibold">
          Datos del pasajero
        </Typography>

        {/* Formulario */}
        <form onSubmit={handleFormSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Campos del formulario */}
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="name1"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="name2"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="surname1"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="surname2"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="dni"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="email"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="phone"
                control={control}
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Género"
                    variant="outlined"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender ? errors.gender.message : ""}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre de contacto"
                    variant="outlined"
                    fullWidth
                    error={!!errors.contactName}
                    helperText={errors.contactName ? errors.contactName.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono de contacto"
                    variant="outlined"
                    fullWidth
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone ? errors.contactPhone.message : ""}
                  />
                )}
              />
            </Grid>

            {/* Botón a la derecha */}
            <Grid item xs={12} className="flex justify-end mt-6">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  backgroundColor: "#0B72B7",
                  "&:hover": { backgroundColor: "#1c4d7e" },
                }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PassengerForm;
