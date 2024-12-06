"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { checkin, getTicket } from "@/services/checkin";
import { 
  Box, 
  Snackbar, 
  Alert, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardActions 
} from "@mui/material";
import { getFlightSeats } from "@/services/flights";

export default function CheckIn() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState<
    "success" | "error" | "info"
  >("info");
  const router = useRouter();

  const schema = z.object({
    flightCode: z
      .string()
      .min(6, {
        message: "El código de vuelo debe tener al menos 6 caracteres",
      })
      .max(12, {
        message: "El código de vuelo no puede tener más de 12 caracteres",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "El código de vuelo solo puede contener letras, números y guiones bajos",
      }),
    passengerDni: z
      .string()
      .min(7, { message: "El DNI del pasajero debe tener mínimo 7 caracteres" })
      .max(15, {
        message: "El DNI del pasajero no puede tener más de 15 caracteres",
      })
      .regex(/^[0-9]+$/, {
        message: "El DNI del pasajero solo puede contener números",
      }),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flightCode: "",
      passengerDni: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await checkin(data.flightCode, data.passengerDni);
      if (response.ok) {
        setSnackBarMessage("Check-in realizado correctamente.");
        setSnackBarSeverity("success");
      } else {
        console.log(response);
        setSnackBarMessage(`Error al realizar el check-in. ${response.message}`);
        setSnackBarSeverity("error");
      }
    } catch (err) {
      setSnackBarMessage("Error al realizar el check-in.");
      setSnackBarSeverity("error");
    } finally {
      setSnackBarOpen(true);
    }
  });

  const changeSeat = async () => {
    try {
      const { flightCode, passengerDni } = getValues();
      const ticket = await getTicket(flightCode, passengerDni);
      console.log("ticket::::", ticket);
      const response = await getFlightSeats(flightCode);
      console.log("response seats::::", response);
      if (response) {
        const query = new URLSearchParams({
          ...response,
          flightCode: flightCode,
          actualSeat: ticket.seatNumber,
          passengerDni: passengerDni,
        });
        router.push(`/check-in/change-seats?${query.toString()}`);
      } else {
        setSnackBarMessage(
          response.message || "Error al obtener los asientos."
        );
        setSnackBarSeverity("error");
      }
    } catch (err) {
      setSnackBarMessage("Error al realizar el check-in.");
      setSnackBarSeverity("error");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      {/* Snackbar */}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackBarOpen(false)}
          severity={snackBarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackBarSeverity === "success"
                ? "#4caf50"
                : snackBarSeverity === "error"
                ? "#f44336"
                : "#2196f3",
            color: "white",
            borderRadius: 2,
            fontSize: "16px",
            boxShadow: 2,
          }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      {/* Card */}
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Check-In
          </Typography>
          <Typography align="center" paragraph>
            Realiza el check-in ingresando el código de vuelo y el DNI del
            pasajero.
          </Typography>
          <form onSubmit={onSubmit}>
            <Controller
              name="flightCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código de vuelo"
                  fullWidth
                  margin="normal"
                  error={!!errors.flightCode}
                  helperText={errors.flightCode?.message}
                />
              )}
            />
            <Controller
              name="passengerDni"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="DNI del pasajero"
                  fullWidth
                  margin="normal"
                  error={!!errors.passengerDni}
                  helperText={errors.passengerDni?.message}
                />
              )}
            />
          </form>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Confirmar Check-In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={changeSeat}
          >
            Cambiar asiento
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
