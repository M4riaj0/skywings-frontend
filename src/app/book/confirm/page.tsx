"use client";

import { useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useCartContext } from "@/context/cart";
import { createBook } from "@/services/purchase";

interface BookTicket {
  flightCode: string;
  passengerDni: string;
  username: string;
  purchaseId: number;
  seatNumber: number;
  price: number;
  creationDate: Date;
  checkIn?: Date;
  numSuitcase: number;
}

function ConfirmPage() {
  const [bookTickets, setBookTickets] = useState<BookTicket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useCartContext();

  async function handleReservation() {
    const res = await createBook(state.cart);
    console.log(res);
    if (res?.statusCode == 400 || res?.statusCode == 500) {
      console.error("Error creating book:", res);
      setError(
        `Error en la reserva. Por favor, inténtelo de nuevo. ${res?.message}`
      );
      return;
    } else if (res?.message) {
      setError(res.message);
      return;
    }
    setBookTickets(res);
    dispatch({ type: "CLEAR_CART" });
    setLoading(false);
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Confirmación de reserva
      </Typography>
      <Box display={loading ? "block" : "none"}>
        <Button
          onClick={handleReservation}
          variant="outlined"
          className="mx-4 mb-4"
        >
          Haz click para confirmar la reserva
        </Button>
      </Box>
      {error && (
        <Alert severity="error">
          {error.split(".").map((err, i) => (
            <Typography key={i}>{err}</Typography>
          ))}
        </Alert>
      )}
      {!error && (
        <Typography variant="h5" gutterBottom>
          Reservas:
        </Typography>
      )}
      <Box component="ul">
        {bookTickets.map((ticket) => (
          <Box component="li" key={ticket.flightCode} mb={2}>
            <Typography variant="h6">Vuelo: {ticket.flightCode}</Typography>
            <Typography>DNI del pasajero: {ticket.passengerDni}</Typography>
            <Typography>Usuario: {ticket.username}</Typography>
            <Typography>Precio: {ticket.price}</Typography>
            <Typography>
              Fecha de creación: {ticket.creationDate.toString()}
            </Typography>
            <Typography>Número de asiento: {ticket.seatNumber}</Typography>
            {/* {ticket.checkIn && (
              <Typography>Check-in Date: {ticket.checkIn.toString()}</Typography>
            )} */}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default ConfirmPage;
