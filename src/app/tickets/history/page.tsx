"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box, Pagination, Snackbar, Alert } from "@mui/material"; // Importa Snackbar y Alert
import TicketCard from "@/components/tickets/ticketCard"; // Asegúrate de que la ruta sea correcta
import { getTicketsHistory } from "@/services/tickets"; // Asegúrate de que la ruta sea correcta

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
  const [successMessage, setSuccessMessage] = useState(""); // Para el mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(""); // Para el mensaje de error
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular los índices para paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  // Manejar cambio de página
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Llamar a la API para obtener el historial de tiquetes
  useEffect(() => {
    const fetchTicketHistory = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await getTicketsHistory();
        if (response.success && response.data) {
          setTickets(response.data);
          setSuccessMessage("Historial cargado exitosamente."); // Mostrar mensaje de éxito
        } else {
          setError(true);
          setErrorMessage(response.message || "Error al cargar el historial."); // Mostrar mensaje de error
        }
        setSuccessMessage("Historial cargado exitosamente."); // Mostrar mensaje de éxito
      } catch (err) {
        setError(true);
        setErrorMessage("Error al cargar el historial."); // Mostrar mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchTicketHistory();
  }, []);

  // Función para cerrar las alertas
  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Box>
      <Typography variant="h5" align="center" className="my-4">
        Historial de Tiquetes
      </Typography>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {error && <Typography variant="body1" color="error">Error al cargar el historial.</Typography>}
      {!loading && !error && tickets.length === 0 && <Typography>No tienes historial de tiquetes.</Typography>}
      {!loading && !error && tickets.length > 0 && (
        <Box>
          {paginatedTickets.map((ticket, index) => (
            <TicketCard key={index} {...ticket} />
          ))}
          <Box className="my-2">
            <Pagination
              count={Math.ceil(tickets.length / itemsPerPage)} // Total de páginas
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              aria-label="Control de paginación para el historial de tiquetes"
            />
          </Box>
        </Box>
      )}

      {/* Snackbar para el mensaje de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar para el mensaje de error */}
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
