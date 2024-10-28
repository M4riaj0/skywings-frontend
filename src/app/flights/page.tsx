"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Button, IconButton } from "@mui/material";
import FlightTable from "@/components/flights/flightTable";
import { getAllFlights, deleteFlight } from "@/services/flights";
import AddIcon from "@mui/icons-material/Add";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [flights, setFlights] = useState([]);
  const [, setOpen] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsList = await getAllFlights();
      setFlights(adminsList);
    };

    fetchAdmins();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDeleteFlight = async (code: string) => {
    console.log(code);
    const res = await deleteFlight(code);
    console.log(res);
    alert(`Vuelo ${code} eliminado exitosamente`);
    // router.refresh()
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
              onClick={handleClickOpen}
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
            onClick={handleClickOpen}
            className="bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
            aria-label="add"
            size="large"
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <FlightTable flights={flights} onDeleteFlight={handleDeleteFlight} />
    </div>
  );
};

export default FlightManager;
