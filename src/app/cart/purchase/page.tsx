"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { IBookTicket } from "@/schemas/tickets";
import { useRouter } from "next/navigation";
import { createPurchase } from "@/services/purchase";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SelectCardDialog from "@/components/finance/selectCardDialog";

const PurchasePage: React.FC = () => {
  const [tickets, setTickets] = useState<IBookTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      const storedTickets = localStorage.getItem("tickets");
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      }
      setIsLoading(false);
    };

    fetchTickets();
  }, []);

  const handlePayment = async (cardDetails: { cardNumber: string; cvv: string }) => {
    setOpenDialog(false);
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

          {/* Mostrar el indicador de carga */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : tickets.length > 0 ? (
            <Box>
              {tickets.map((ticket, index) => (
                <Card key={index} sx={{ marginBottom: 2, borderRadius: 2 }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
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
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
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
            <Typography>No hay tickets disponibles en tu carrito.</Typography>
          )}
        </Box>
      </Box>

      {/* Botón de pago */}
      <Box className="flex justify-end items-center p-5">
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleOpenDialog}
          disabled={tickets.length === 0} // Deshabilitar si no hay tickets
        >
          Seleccionar tarjeta y pagar
        </Button>
      </Box>

      {/* Diálogo de selección de tarjeta */}
      <SelectCardDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handlePayment}
      />
    </>
  );
};

export default PurchasePage;
