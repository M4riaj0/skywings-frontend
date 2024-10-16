"use client";
import { useState, useEffect } from "react";
import { Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAdminDialog from "@/components/admins/addAdminDialog";
import FlightTable from "@/components/flights/flightTable";
import { getAdmins, addAdmin, deleteAdmin } from "@/services/admins";
// import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const FlightManager = () => {
  const [admins, setAdmins] = useState([
  ]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsList = await getAdmins();
      setAdmins(adminsList);
    };

    fetchAdmins();
  }, []);

  const [open, setOpen] = useState(false);

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

  //Cambiar al conectar con el back
  const handleAddAdmin = async (newAdmin: Admin) => {
    const res = await addAdmin(newAdmin);
    if (res && res.username) {
      alert(`Nuevo administrador creado: ${res.username}`);
      setAdmins(await getAdmins());
      // router.refresh()
      handleClose();
    } else {
      alert("Error al crear el administrador. Por favor, inténtelo de nuevo.");
    }
  };

  const handleDeleteFlight = async (username: string) => {
    console.log(username);
    const res = await deleteAdmin(username);
    alert(`Administrador eliminado: ${res.username}`); // Imprimir en consola el username del admin eliminado
    // router.refresh()
    setAdmins(await getAdmins());
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

      <AddAdminDialog
        open={open}
        onClose={handleClose}
        onAddAdmin={handleAddAdmin}
      />
    </div>
  );
};

export default FlightManager;
