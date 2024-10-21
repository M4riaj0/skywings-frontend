"use client";
import { useState, useEffect } from "react";
import { Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAdminDialog from "@/components/admins/addAdminDialog";
import AddFlightDialog from "@/components/flights/addFlightDialog";
import FlightTable from "@/components/flights/flightTable";
import { getAdmins, addAdmin, deleteAdmin } from "@/services/admins";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsList = await getAdmins();
      setAdmins(adminsList);
    };

    fetchAdmins();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  interface Admin {
    username: string;
    email: string;
    password: string;
  }

  const handleDeleteFlight = async (username: string) => {
    console.log(username);
    const res = await deleteAdmin(username);
    alert(`Administrador eliminado: ${res.username}`);
    // router.refresh()
    setAdmins(await getAdmins());
  };

  // Función para agregar vuelo
  const handleAddFlight = async (newFlight: {
    code: string;
    origin: string;
    destination: string;
    departureDate1: string;
    arrivalDate1: string;
    departureDate2: string;
    arrivalDate2: string;
    priceFirstClass: number;
    priceEconomyClass: number;
  }) => {
    // Aquí puedes agregar la lógica para agregar un vuelo, por ejemplo:
    alert(`Nuevo vuelo agregado: ${JSON.stringify(newFlight)}`);
    handleClose();
    // Actualiza el estado de los vuelos si es necesario
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Vuelos
        </Typography>

        <div className="hidden md:flex">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            className="flex items-center"
            startIcon={<AddIcon />}
          >
            Crear vuelo
          </Button>
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

      <FlightTable flights={admins} onDeleteFlight={handleDeleteFlight} />

      <AddFlightDialog
        open={open}
        onClose={handleClose} 
        onAddFlight={handleAddFlight}
      />
    </div>
  );
};

export default FlightManager;
