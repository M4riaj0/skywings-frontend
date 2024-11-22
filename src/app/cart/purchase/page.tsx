"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from "@mui/material";
import { IBookTicket } from "@/app/schemas/tickets";
import NoItemsAvailable from "@/components/noItems";
import { useRouter } from "next/navigation";
import { createPurchase } from "@/services/purchase";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SelectCardDialog from "@/components/finance/selectCardDialog"; 

const PurchasePage: React.FC = () => {
  const [tickets, setTickets] = useState<IBookTicket[]>([]);
  const [error, setError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar la visibilidad del diálogo
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const storedTickets = localStorage.getItem("tickets");
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    }
  }, []);

  const handlePayment = async (cardDetails: { cardNumber: string; cvv: string }) => {
    const paymentRes = await createPurchase({
      cardNumber: cardDetails.cardNumber,
      cvv: cardDetails.cvv,
      tickets,
    });

    if (paymentRes?.message) {
      setError(paymentRes.message);
      return;
    }

    localStorage.removeItem("tickets");
    setError("");
    setOpenSuccess(true);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    router.push("/");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true); // Abrir el diálogo
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cerrar el diálogo
  };

  return (
    <>
      {/* Success Dialog */}
      {openSuccess && (
        <Box>
          <Typography variant="h6" color="success">
            Compra exitosa. Gracias por su compra.
            <Button onClick={handleCloseSuccess}>Cerrar</Button>
          </Typography>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Box sx={{ margin: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" padding="20px">
        <Box
          flex={1}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 2,
            padding: 3,
            marginRight: 2,
          }}
        >
          <Typography variant="h4">Resumen de compra</Typography>
          <Divider sx={{ my: 2 }} />
          {tickets.length > 0 ? (
            <Box>
              {tickets.map((ticket, index) => (
                <Card key={index} sx={{ marginBottom: 2, borderRadius: 2 }}>
                    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AirplaneTicketIcon sx={{ marginRight: 2, fontSize: "2rem" }} />
                        <Typography sx={{ fontWeight: "bold", marginRight: 2 }}>
                          {ticket.flightCode}
                        </Typography>
                      </Box>
                      
                        <Box className="flex items-center justify-center bg-gray-200 text-center px-6 rounded-lg">
                          <div>
                            <Typography variant="body2" className="text-gray-500 text-sm">
                            Precio
                            </Typography>
                            <Typography variant="h6" className="font-bold text-gray-800">
                            {ticket.price.toLocaleString()} COP
                            </Typography>
                          </div>
                        </Box>
                      </CardContent>
                </Card>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 6  ,}}>
                <Typography
                  sx={{
                    padding: 1,
                    fontWeight: "bold",
                    flexGrow: 1,
                  }}
                >
                  Total
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-800 align-right">
                  {tickets.reduce((acc, ticket) => acc + ticket.price, 0)} COP
                </Typography>
              </Box>
            </Box>
          ) : (
            <NoItemsAvailable message="Tu carrito está vacío." />
          )}
        </Box>
      </Box>

      {/* Botón de pago */}
      <Box display="flex" justifyContent="flex-end" padding="20px">
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleOpenDialog} // Abrir el diálogo de selección de tarjeta
        >
          Seleccionar tarjeta y pagar
        </Button>
      </Box>

      {/* Diálogo de selección de tarjeta */}
      <SelectCardDialog
        open={openDialog}
        onClose={handleCloseDialog} // Cerrar el diálogo
        onConfirm={handlePayment} // Pasamos la función de pago como confirmación
      />
    </>
  );
};

export default PurchasePage;
