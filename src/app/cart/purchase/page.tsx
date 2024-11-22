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
} from "@mui/material";
import { Card } from "@/app/schemas/cards";
import { IBookTicket } from "@/app/schemas/tickets";
import React, { useEffect, useState } from "react";

interface PartialCard extends Partial<Card> {}

const PurchasePage: React.FC = () => {
  const [tickets, setTickets] = useState<IBookTicket[]>([]);
  const [cards, setCards] = useState<PartialCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cvv, setCvv] = useState<number>();
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    // Fetch tickets from local storage
    // const storedTickets = localStorage.getItem('tickets');
    // if (storedTickets) {
    //   setTickets(JSON.parse(storedTickets));
    // }

    // Set static tickets for initial state
    const staticTickets: IBookTicket[] = [
      {
        flightCode: "FL123",
        passengerDni: "123456789",
        username: "Alice Johnson",
        purchaseId: 1,
        seatNumber: 12,
        price: 200,
        creationDate: new Date(),
        numSuitcase: 1,
      },
      {
        flightCode: "FL456",
        passengerDni: "987654321",
        username: "Bob Smith",
        purchaseId: 2,
        seatNumber: 14,
        price: 150,
        creationDate: new Date(),
        numSuitcase: 2,
      },
    ];
    setTickets(staticTickets);

    // Fetch registered cards (mock data for now)
    const userCards: PartialCard[] = [
      {
        number: "1234 5678 9012 3456",
        expirationDate: "12/24",
        propietary: "John Doe",
        balance: 1000,
      },
      {
        number: "9876 5432 1098 7654",
        expirationDate: "11/23",
        propietary: "Jane Smith",
        balance: 500,
      },
    ];
    setCards(userCards);
  }, []);

  const handlePayment = () => {
    if (selectedCard === null) {
      setError("Por favor, seleccione una tarjeta.");
      return;
    }

    if (cvv?.toString().length !== 3) {
      setError("Por favor, ingrese el CVV.");
      return;
    }

    // Proceed with payment processing
    const selectedCardDetails = cards[selectedCard];
    console.log({
      cardnumber: selectedCardDetails.number,
      cvv: cvv,
      tickets: tickets,
    })

    // Here you would typically call an API to process the payment
    // For now, we'll just log the payment details
    alert("Pago realizado con éxito!");
    setError("");
  };

  return (
    <>
      {error && <Alert severity="warning" className="mx-auto my-4">{error}</Alert>}
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
          {tickets.length > 0 ? (
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
            <Typography>No tickets to display</Typography>
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
                      Card ending in **** {card?.number ? card.number.slice(-4) : "N/A"}
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
                    name="cvv"
                    value={cvv}
                    className="rounded"
                    inputProps={{ maxLength: 3, minLength: 3 }}
                    onChange={(e) =>
                      setCvv(parseInt(e.target.value) || undefined)
                    }
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No hay tarjetas registradas</Typography>
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
