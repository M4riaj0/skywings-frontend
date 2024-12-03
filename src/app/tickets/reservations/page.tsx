"use client";
import React, { useState, useEffect } from "react";
import { Typography, Box, Pagination, Snackbar, Alert } from "@mui/material";
import TicketCard from "@/components/tickets/ticketCard"; 
import { cancelTicket, getReservationTickets } from "@/services/tickets";
import NoItemsAvailable from "@/components/noItems";
import SelectCardDialog from "@/components/finance/selectCardDialog";
import { purchaseCreate } from "@/services/purchase";

interface Ticket {
    flightCode: string;
    passengerDni: string;
    username: string;
    seatNumber: number;
    price: number;
    creationDate: string;
    checkIn?: Date | null;
    numSuitcase: number;
    erased?: boolean;
}

export default function ReservationsTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false); 
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); 
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error" | "info">("info");
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTickets = tickets.slice(startIndex, endIndex);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const fetchActiveTickets = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await getReservationTickets();
            if (Array.isArray(data.data)) {
                setTickets(data.data);
            } else {
                console.warn("Datos no válidos recibidos del servidor");
                setTickets([]);
            }
        } catch (err) {
            console.error("Error al cargar los tiquetes activos:", err);
            setError(true);
            setSnackBarMessage("Error al cargar los tiquetes activos.");
            setSnackBarSeverity("error");
            setSnackBarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveTickets();
    }, []);

    const handleBuyTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket); 
        setDialogOpen(true); 
    };
    
    const handleCancelTicket = async (flightCode: string, passengerDni: string): Promise<void> => {
        try {
            const response = await cancelTicket({ flightCode, passengerDni });
    
            if (response.success) {
                setSnackBarMessage("Tiquete cancelado correctamente.");
                setSnackBarSeverity("success");
            } else {
                setSnackBarMessage(response.message || "Error al cancelar el tiquete.");
                setSnackBarSeverity("error");
            }
        } catch (err) {
            console.error("Error al cancelar el tiquete:", err);
            setSnackBarMessage("Error al cancelar el tiquete.");
            setSnackBarSeverity("error");
        } finally {
            setSnackBarOpen(true);
            await fetchActiveTickets(); // Recargar los datos desde el servidor
        }
    };
    
    const handleConfirmCard = async ({ cardNumber, cvv }: { cardNumber: string; cvv: string }) => {
        setDialogOpen(false);
        if (!selectedTicket) return;
    
        try {
            const response = await purchaseCreate({
                flightCode: selectedTicket.flightCode,
                passengerDni: selectedTicket.passengerDni,
                cardNumber,
                cvv,
            });
    
            if (response.purchase) {
                setSnackBarMessage("Tiquete comprado correctamente.");
                setSnackBarSeverity("success");
            } else {
                setSnackBarMessage(response.message || "No se pudo realizar la compra.");
                setSnackBarSeverity("error");
            }
        } catch (err) {
            console.error("No se pudo comprar el tiquete:", err);
            setSnackBarMessage("No se pudo realizar la compra.");
            setSnackBarSeverity("error");
        } finally {
            setSnackBarOpen(true);
            await fetchActiveTickets(); // Recargar los datos desde el servidor
        }
    };

    return (
        <Box>
            <Snackbar
              open={snackBarOpen}
              autoHideDuration={6000} 
              onClose={() => setSnackBarOpen(false)}  
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ bottom: 600, right: 50 }}
            >
              <Alert
                  onClose={() => setSnackBarOpen(false)}  
                  severity={snackBarSeverity}
                  sx={{
                    width: '100%',
                    backgroundColor: snackBarSeverity === 'success' ? '#4caf50' : snackBarSeverity === 'error' ? '#f44336' : '#2196f3',
                    color: 'white',
                    borderRadius: 2,
                    fontSize: '16px', 
                    boxShadow: 2,
                }}
              >
                  {snackBarMessage}
              </Alert>
            </Snackbar>

            <Typography variant="h4" component="h1" className="font-bold my-4">
                Reservas
            </Typography>

            {loading && <Typography variant="body1">Cargando...</Typography>}
            {error && (
                <Box className="error-box">
                    Error al cargar los tiquetes.
                </Box>
            )}

            {!loading && !error && tickets.length === 0 && (
                <Box className="min-h-screen items-center justify-center">
                    <NoItemsAvailable message="No tienes reservas activas en este momento." />
                </Box>
            )}

            {!loading && !error && tickets.length > 0 && (
                <Box>
                    {paginatedTickets.map((ticket, index) => (
                        <TicketCard
                            key={index}
                            {...ticket}
                            onCancel={() => handleCancelTicket(ticket.flightCode, ticket.passengerDni)}
                            onBuy={() => handleBuyTicket(ticket)}
                        />
                    ))}
                    <Box className="my-4">
                        <Pagination
                            count={Math.ceil(tickets.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            aria-label="Control de paginación para los tiquetes activos"
                        />
                    </Box>
                </Box>
            )}

            {/* Componente de selección de tarjeta */}
            <SelectCardDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmCard}
            />
        </Box>
    );
}
