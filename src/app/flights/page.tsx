"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Button, IconButton } from "@mui/material";
import FlightTable from "@/components/flights/flightTable";
import { getAllFlights, updateFlight, deleteFlight } from "@/services/flights";
import AddIcon from "@mui/icons-material/Add";
import { FlightFormUpdate } from "@/app/schemas/flightFormSchema";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      setFlights(await getAllFlights());
    };

    fetchFlights();
  }, []);

  const handleUpdateFlight = async (updatedFlight: FlightFormUpdate) => {
    console.log(updatedFlight);
    const res = await updateFlight(updatedFlight);
    console.log(res);
    alert("Vuelo actualizado exitosamente");
    setFlights(await getAllFlights());
  }

  const handleDeleteFlight = async (code: string) => {
    console.log(code);
    const res = await deleteFlight(code);
    console.log(res);
    alert(`Vuelo ${code} eliminado exitosamente`);
    setFlights(await getAllFlights());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Vuelos
        </Typography>

        <div className="hidden md:flex">
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

      <FlightTable flights={flights} onSaveFlight={handleUpdateFlight} onDeleteFlight={handleDeleteFlight} />
    </div>
  );
};

export default FlightManager;
