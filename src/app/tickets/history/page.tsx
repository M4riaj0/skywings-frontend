"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box, Pagination, Snackbar, Alert } from "@mui/material";
import TicketCard from "@/components/tickets/ticketCard"; 
import { getTicketsHistory } from "@/services/tickets"; 
import NoItemsAvailable from "@/components/noItems";

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

export default function TicketHistoryPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchTicketHistory = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await getTicketsHistory();
        if (response.success && response.data) {
          setTickets(response.data);
          setSuccessMessage("Historial cargado exitosamente.");
        } else {
          setError(true);
          setErrorMessage(response.message || "Error al cargar el historial.");
        }
        setSuccessMessage("Historial cargado exitosamente.");
      } catch (err) {
        setError(true);
        setErrorMessage("Error al cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketHistory();
  }, []);

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="font-bold my-4">
        Historial de Tiquetes
      </Typography>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {error && <Typography variant="body1" color="error">Error al cargar el historial.</Typography>}
      {!loading && !error && tickets.length === 0 &&   <Box className="min-h-screen items-center justify-center"><NoItemsAvailable message="No tienes historial de tiquetes." /></Box>}
      {!loading && !error && tickets.length > 0 && (
        <Box>
          {paginatedTickets.map((ticket, index) => (
            <TicketCard key={index} {...ticket} />
          ))}
          <Box className="my-2">
            <Pagination
              count={Math.ceil(tickets.length / itemsPerPage)} 
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              aria-label="Control de paginación para el historial de tiquetes"
            />
          </Box>
        </Box>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
