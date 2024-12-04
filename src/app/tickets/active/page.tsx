"use client";
import React, { useState, useEffect } from "react";
import { Typography, Box, Pagination, Snackbar, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import TicketCard from "@/components/tickets/ticketCard"; 
import { getActiveTickets, cancelTicket } from "@/services/tickets";
import { getFlightSeats } from "@/services/flights"
import { checkin } from "@/services/checkin"
import NoItemsAvailable from "@/components/noItems";
import { useRouter } from "next/navigation";

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

export default function ActiveTicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error" | "info">("info");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentCheckIn, setCurrentCheckIn] = useState<{ flightCode: string; passengerDni: string; seatNumber: number } | null>(null);

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
            const data = await getActiveTickets();
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

    const handleCancelTicket = async (flightCode: string, passengerDni: string): Promise<void> => {
        try {
            const response = await cancelTicket({ flightCode, passengerDni });
    
            if (response.success) {
                setSnackBarMessage("Tiquete cancelado correctamente.");
                setSnackBarSeverity("success");
    
                // Recargar los datos desde el servidor
                const updatedData = await getActiveTickets();
                setTickets(updatedData.data || []);
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
        }
    };

    const handleCheckIn = async (flightCode: string, passengerDni: string, seatNumber: number): Promise<void> => {
        setCurrentCheckIn({ flightCode, passengerDni, seatNumber });
        setDialogOpen(true);
    };

    const confirmCheckIn = async () => {
        if (!currentCheckIn) return;
        const { flightCode, passengerDni } = currentCheckIn;

        try {
            const response = await checkin(flightCode, passengerDni);
            console.log("response active::", response)

            if (response.ok) {
                setSnackBarMessage("Check-in realizado correctamente.");
                setSnackBarSeverity("success");

                const updatedData = await getActiveTickets();
                setTickets(updatedData.data || []);
            } else {
                console.log("error:")
                setSnackBarMessage("Error al realizar el check-in.");
                setSnackBarSeverity("error");
            }
        } catch (err) {
            console.log("response cattch::", err)
            console.error("Error al realizar el check-in:", err);
            setSnackBarMessage("Error al realizar el check-in.");
            setSnackBarSeverity("error");
        } finally {
            setDialogOpen(false);
            setSnackBarOpen(true);
            fetchActiveTickets();
        }
    };

    const changeSeat = async () => {
        if (!currentCheckIn) return;
        const { flightCode, passengerDni, seatNumber } = currentCheckIn;

        try {
            const response = await getFlightSeats(flightCode);
            if (response) {
                const query = new URLSearchParams({
                    ...response,
                    flightCode: flightCode,
                    actualSeat: seatNumber,
                    passengerDni: passengerDni
                });
                router.push(`/check-in/change-seats?${query.toString()}`);
            } else {
                setSnackBarMessage(response.message || "Error al obtener los asientos.");
                setSnackBarSeverity("error");
            }
        } catch (err) {
            console.error("Error al realizar el check-in:", err);
            setSnackBarMessage("Error al realizar el check-in.");
            setSnackBarSeverity("error");
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <Box>
            {/* Snackbar */}
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

            {/* Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirmar Check-In</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas confirmar el check-in para el asiento {currentCheckIn?.seatNumber}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Button onClick={changeSeat} variant="text" color="primary" className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-200">
                            Cambiar Asiento
                        </Button>
                        <Box display="flex" gap={2}>
                            <Button onClick={() => setDialogOpen(false)} color="error">
                                Cancelar
                            </Button>
                            <Button onClick={confirmCheckIn} variant="contained" color="primary">
                                Confirmar
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>


            {/* Page Content */}
            <Typography variant="h4" component="h1" className="font-bold my-4">
                Tiquetes Activos
            </Typography>

            {loading && <Typography variant="body1">Cargando...</Typography>}
            {error && (
                <Box
                    sx={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: 2,
                        borderRadius: 2,
                        marginBottom: 2,
                        fontWeight: 'bold',
                    }}
                >
                    Error al cargar los tiquetes.
                </Box>
            )}

            {!loading && !error && tickets.length === 0 && (
                <Box className="min-h-screen items-center justify-center">
                    <NoItemsAvailable message="No tienes tiquetes activos." />
                </Box>
            )}

            {!loading && !error && tickets.length > 0 && (
                <Box>
                    {paginatedTickets.map((ticket, index) => (
                        <TicketCard
                            key={index}
                            {...ticket}
                            onCancel={() => handleCancelTicket(ticket.flightCode, ticket.passengerDni)}
                            onCheckin={() => handleCheckIn(ticket.flightCode, ticket.passengerDni, ticket.seatNumber)}
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
        </Box>
    );
}
