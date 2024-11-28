"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import { useCartContext } from "@/context/cart";
import { createBook } from "@/services/purchase";
import { IBookTicket } from "@/schemas/tickets";
import { useRouter } from "next/navigation";
import FlightIcon from "@mui/icons-material/Flight";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
// import CreditCardIcon from "@mui/icons-material/CreditCard";

function ConfirmPage() {
  const [bookTickets, setBookTickets] = useState<IBookTicket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { state, dispatch } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    if (bookTickets.length > 0) setDialogOpen(false);
  }, [bookTickets]);

  async function handleReservation() {
    setLoading(true);
    setError(null);
    setDialogOpen(false);
    
    const res = await createBook(state.cart);
    
    if (res?.statusCode === 400 || res?.statusCode === 500) {
      setError(`Error en la reserva. Por favor, inténtelo de nuevo. ${res?.message}`);
      setLoading(false);
      return;
    } else if (res?.message) {
      setError(res.message);
      setLoading(false);
      return;
    }
  
    setBookTickets(res);
    dispatch({ type: "CLEAR_CART" });
    setLoading(false);
  
  }
  

  return (
    <Box sx={{ padding: 4 }}>
      {loading && (
        <Box sx={{ textAlign: "center", marginY: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Procesando reserva...
          </Typography>
        </Box>
      )}

      {!loading && bookTickets.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Detalles de la Reserva
          </Typography>
          {bookTickets.map((ticket, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: 3,
                padding: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  <FlightIcon
                    sx={{
                      fontSize: "2rem",
                      color: "#1976d2",
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="h6" color="primary">
                    Vuelo: {ticket.flightCode}
                  </Typography>
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                  <PersonIcon
                    sx={{
                      fontSize: "1.5rem",
                      color: "#757575",
                      marginRight: 1,
                    }}
                  />
                  <Typography>Comprador: {ticket.username}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                  <BadgeIcon 
                  sx={{
                    fontSize: "1.5rem",
                    color: "#757575",
                    marginRight: 1,
                  }}
                  />
                  <Typography>DNI Pasajero: {ticket.passengerDni}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                  <FlightClassIcon 
                  sx={{
                      fontSize: "1.5rem",
                      color: "#757575",
                      marginRight: 1,
                    }}/>
                  <Typography>Asiento: {ticket.seatNumber}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "1rem", color: "#757575" }}>
                    Precio Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {ticket.price.toLocaleString()} COP
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 2, color: "#757575", fontStyle: "italic" }}
                >
                  Fecha de creación: {new Date(ticket.creationDate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={() => router.push("/")}
          >
            Aceptar
          </Button>
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setDialogOpen(false);
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas confirmar la reserva? Esto procesará todos los tiquetes en
            tu carrito.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch({ type: "CLEAR_CART" });
              setDialogOpen(false);
              router.push("/")
            }}
            color="secondary"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button onClick={handleReservation} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ marginTop: 3 }}>
          {error.split(".").map((err, i) => (
            <Typography key={i}>{err}</Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
}

export default ConfirmPage;
