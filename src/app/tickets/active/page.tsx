"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box, Pagination, Snackbar, Alert } from "@mui/material";
import TicketCard from "@/components/tickets/ticketCard"; 
import { getActiveTickets, cancelTicket } from "@/services/tickets";

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
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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

    useEffect(() => {
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

        fetchActiveTickets();
    }, []);

    const handleCancelTicket = async (flightCode: string, passengerDni: string) => {
        try {
            const response = await cancelTicket({ flightCode, passengerDni });
    
            // Verifica si la cancelación fue exitosa
            if (response.success) {
                // Si es exitosa, elimina el tiquete de la lista
                setTickets((prevTickets) =>
                    prevTickets.filter(
                        (ticket) => ticket.flightCode !== flightCode || ticket.passengerDni !== passengerDni
                    )
                );
                setSnackBarMessage("Tiquete cancelado correctamente.");
                setSnackBarSeverity("success");
            } else {
                // Si no fue exitosa, muestra el mensaje de error
                setSnackBarMessage(response.message || "Error al cancelar el tiquete.");
                setSnackBarSeverity("error");
            }
            setSnackBarOpen(true);
        } catch (err) {
            console.error("Error al cancelar el tiquete:", err);
            setSnackBarMessage("Error al cancelar el tiquete.");
            setSnackBarSeverity("error");
            setSnackBarOpen(true);
        }
    };
    

    return (
        <Box>
            {/* Snackbar para mostrar notificaciones */}
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
                        fontWeight: 'bold'
                    }}
                >
                    Error al cargar los tiquetes.
                </Box>
            )}

            {!loading && !error && tickets.length === 0 && (
                <p className="text-center text-gray-500">No tienes tiquetes activos.</p>
            )}

            {!loading && !error && tickets.length > 0 && (
                <Box>
                    {paginatedTickets.map((ticket, index) => (
                        <TicketCard
                            key={index}
                            {...ticket}
                            onCancel={() => handleCancelTicket(ticket.flightCode, ticket.passengerDni)}
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
