"use client";
import { useState, useEffect } from "react";
import { Typography, Button, IconButton, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAdminDialog from "@/components/admins/addAdminDialog";
import AdminTable from "@/components/admins/adminTable";
import { getAdmins, addAdmin, deleteAdmin } from "@/services/admins";

export const dynamic = "force-dynamic";

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const [open, setOpen] = useState(false);

  const fetchAdmins = async () => {
    try {
      const adminsList = await getAdmins();
      setAdmins(adminsList);
    } catch (error) {
      setErrorMessage("Error al obtener la lista de administradores");
      console.error(error);
    }
  };

  useEffect(() => {
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
  }

  const handleAddAdmin = async (newAdmin: Admin) => {
    try {
      const res = await addAdmin(newAdmin);
      if (res && res.username) {
        setSuccess(`Administrador creado: ${res.username}`);
        setErrorMessage("");
        setWarning("");
        await fetchAdmins(); 
        handleClose();
      } else {
        setErrorMessage("Error al crear el administrador:\n" + res.message);
        setSuccess("");
        setWarning("");
      }
    } catch (error) {
      setErrorMessage("Error al crear el administrador");
      console.error(error);
    }
  };

  const handleDeleteAdmin = async (username: string) => {
    try {
      const res = await deleteAdmin(username);
      setWarning(`Administrador eliminado: ${res.username}`);
      setSuccess("");
      setErrorMessage("");
      await fetchAdmins(); 
    } catch (error) {
      setErrorMessage("Error al eliminar el administrador");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Administradores
        </Typography>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {success && (
          <Alert severity="success">{success}</Alert>
        )}
        {warning && (
          <Alert severity="warning">{warning}</Alert>
        )}

        {/* Botón para pantallas grandes */}
        <div className="hidden md:flex">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            className="flex items-center"
            startIcon={<AddIcon />}
          >
            Agregar Admin
          </Button>
        </div>

        {/* Botón circular para pantallas pequeñas */}
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

      {/* Pasar la lista de administradores y la función de eliminar */}
      <AdminTable admins={admins} onDeleteAdmin={handleDeleteAdmin} />

      <AddAdminDialog
        open={open}
        onClose={handleClose}
        onAddAdmin={handleAddAdmin}
      />
    </div>
  );
};

export default AdminManager;
