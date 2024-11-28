"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Button, IconButton, Alert, Box } from "@mui/material";
import FlightTable from "@/components/flights/flightTable";
import {
  getAvaliableFlights,
  updateFlight,
  deleteFlight,
} from "@/services/flights";
import AddIcon from "@mui/icons-material/Add";
import { FlightFormUpdate } from "@/schemas/flightFormSchema";
import NoItemsAvailable from "@/components/noItems";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [flights, setFlights] = useState([]);
  const [errorMessage, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      setFlights(await getAvaliableFlights());
    };

    fetchFlights();
  }, []);

  const handleUpdateFlight = async (updatedFlight: FlightFormUpdate) => {
    // console.log(updatedFlight);
    const res = await updateFlight(updatedFlight);
    // console.log(res);
    if (res.code) setSuccess("Vuelo actualizado exitosamente");
    else setError(`Error al actualizar el vuelo: ${res?.message}`);
    setFlights(await getAvaliableFlights());
  };

  const handleDeleteFlight = async (code: string) => {
    // console.log(code);
    const res = await deleteFlight(code);
    // console.log(res);
    if (res == true) setSuccess(`Vuelo ${code} eliminado exitosamente`);
    else setError(`Error al eliminar el vuelo: ${res?.message}`);
    setFlights(await getAvaliableFlights());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Vuelos
        </Typography>

        <div className="hidden md:flex items-center space-x-2">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Link href="/flights/create">
            <Button
              variant="contained"
              color="primary"
              className="flex items-center"
              startIcon={<AddIcon />}
            >
              Crear vuelo
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <IconButton
            color="primary"
            className="text-white  transition duration-300"
            aria-label="add"
            size="large"
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      {flights.length === 0 && (
        <Box className="min-h-screen items-center justify-center">
            <NoItemsAvailable message="No tienes vuelos activos en este momento. " />
        </Box>
      )}
      {flights.length > 0 && (
        <FlightTable
          flights={flights}
          onSaveFlight={handleUpdateFlight}
          onDeleteFlight={handleDeleteFlight}
        />
      )}
    </div>
  );
};

export default FlightManager;
