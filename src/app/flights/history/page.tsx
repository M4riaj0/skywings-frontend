"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Button, IconButton } from "@mui/material";
import FlightTable from "@/components/flights/flightTable";
import { getRealizedFlights } from "@/services/flights";
import AddIcon from "@mui/icons-material/Add";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      setFlights(await getRealizedFlights());
    };

    fetchFlights();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Historial de Vuelos
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

      <FlightTable flights={flights} />
    </div>
  );
};

export default FlightManager;
