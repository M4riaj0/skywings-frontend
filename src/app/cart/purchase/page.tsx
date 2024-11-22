"use client";

import {
  Alert,
  Box,
  Button,
  Divider,
  Input,
  InputLabel,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Card } from "@/app/schemas/cards";
import { IBookTicket } from "@/app/schemas/tickets";
import React, { useEffect, useState } from "react";
import { getCards } from "@/services/cards";
import { createPurchase } from "@/services/purchase";

interface PartialCard extends Partial<Card> {}

const PurchasePage: React.FC = () => {
  const [tickets, setTickets] = useState<IBookTicket[]>([]);
  const [cards, setCards] = useState<PartialCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cvv, setCvv] = useState<number>();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const storedTickets = localStorage.getItem("tickets");
      console.log("tickets", storedTickets);
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      }

      const res = await getCards();
      setCards(res);
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  const handlePayment = async () => {
    if (selectedCard === null) {
      setError("Por favor, seleccione una tarjeta.");
      return;
    }

    if (cvv?.toString().length !== 3) {
      setError("Por favor, ingrese el CVV.");
      return;
    }

    const selectedCardDetails = cards[selectedCard];
    if (!selectedCardDetails.number) {
      setError("Número de tarjeta no válido.");
      return;
    }

    const paymentRes = await createPurchase({
      cardNumber: selectedCardDetails.number,
      cvv: cvv.toString(),
      tickets: tickets,
    });

    if (paymentRes?.message) {
      setError(paymentRes.message);
      return;
    }
    console.log("Payment successful", paymentRes);

    localStorage && localStorage.removeItem("tickets");
    setError("");
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Compra Exitosa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Su compra ha sido realizada con éxito. Gracias por su compra.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <Alert severity="warning" className="mx-auto my-4">
          {error}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" padding="20px">
        <Box
          flex={1}
          className="rounded-lg shadow-md pt-4 px-1 mr-12 border"
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4" className="px-4">
            Resumen de compra
          </Typography>
          <Divider className="py-2 mx-3" />
          {tickets && tickets.length > 0 ? (
            <>
              <Box component="ul" className="p-3">
                {tickets.map((ticket, index) => (
                  <Box component="li" key={index}>
                    <Typography>Ticket ID: {ticket.flightCode}</Typography>
                    <Typography>Precio: ${ticket.price}</Typography>
                  </Box>
                ))}
              </Box>
              <Typography
                className="p-3 m-1 rounded"
                sx={{ backgroundColor: "#d5daf6" }}
              >
                Total: ${tickets.reduce((acc, ticket) => acc + ticket.price, 0)}
              </Typography>
            </>
          ) : (
            <Typography className="py-2 mx-3">No hay tiquetes para mostrar</Typography>
          )}
        </Box>
        <Box
          flex={1}
          className="rounded-lg shadow-md p-4 ml-12 border"
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Typography variant="h4">Tarjetas registradas</Typography>
          <Divider className="py-2" />
          {cards.length > 0 ? (
            <Box>
              <Typography variant="h6">
                Seleccione una tarjeta para el pago
              </Typography>
              {cards.map((card, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Input
                    type="radio"
                    id={`card-${index}`}
                    name="selectedCard"
                    value={index}
                    onChange={() => setSelectedCard(index)}
                  />
                  <InputLabel
                    htmlFor={`card-${index}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography marginLeft="10px">
                      Tarjeta terminada en ****{" "}
                      {card?.number ? card.number.slice(-4) : "N/A"}
                    </Typography>
                  </InputLabel>
                </Box>
              ))}
              {selectedCard !== null && (
                <Box marginTop="10px" className="rounded">
                  <TextField
                    label="Enter CVV"
                    type="password"
                    id="cvv"
                    defaultValue={cvv}
                    className="rounded"
                    slotProps={{ htmlInput: { maxLength: 3, minLength: 3 } }}
                    onBlur={(e) =>
                      setCvv(parseInt(e.target.value) || undefined)
                    }
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Typography className="py-2 mx-3">No hay tarjetas registradas</Typography>
          )}
        </Box>
      </Box>
      <Box position="fixed" bottom="80px" right="80px">
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Pagar
        </Button>
      </Box>
    </>
  );
};

export default PurchasePage;
