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
        message: "El nombre de usuario debe tener al menos 6 caracteres",
      })
      .max(12, {
        message: "El nombre de usuario no puede tener más de 12 caracteres",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos",
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
      console.log("response active::", response);

      if (response.ok) {
        setSnackBarMessage("Check-in realizado correctamente.");
        setSnackBarSeverity("success");
      } else {
        console.log("error:");
        setSnackBarMessage("Error al realizar el check-in.");
        setSnackBarSeverity("error");
      }
    } catch (err) {
      console.log("response cattch::", err);
      console.error("Error al realizar el check-in:", err);
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
      const response = await getFlightSeats(flightCode);
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
      console.error("Error al realizar el check-in:", err);
      setSnackBarMessage("Error al realizar el check-in.");
      setSnackBarSeverity("error");
    }
  };

  return (
    <Box>
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
      <Typography variant="h4" className="text-center my-8">
        Check-In
      </Typography>
      <form onSubmit={onSubmit} className="w-3/5 mx-auto my-16">
        <Typography>
          Realiza el check-in ingresando el código de vuelo y el DNI del
          pasajero.
        </Typography>
        <Controller
          name="flightCode"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Código de vuelo"
              fullWidth
              margin="dense"
              error={!!errors.flightCode}
              helperText={errors.flightCode ? errors.flightCode.message : ""}
            />
          )}
        />
        <Controller
          name="passengerDni"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="DNI del pasajero"
              fullWidth
              margin="dense"
              error={!!errors.passengerDni}
              helperText={
                errors.passengerDni ? errors.passengerDni.message : ""
              }
            />
          )}
        />
        <Box className="w-full flex justify-between my-4">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ opacity: 1 }}
          >
            Confirmar Check-In
          </Button>
          <Button
            onClick={changeSeat}
            variant="contained"
            color="secondary"
            style={{ opacity: 1 }}
          >
            Cambiar asiento
          </Button>
        </Box>
      </form>
    </Box>
  );
}
