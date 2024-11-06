"use client";
import { useState, useEffect } from "react";
import { Typography, Button, IconButton, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAdminDialog from "@/components/admins/addAdminDialog";
import AdminTable from "@/components/admins/adminTable";
import { getAdmins, addAdmin, deleteAdmin } from "@/services/admins";

export const dynamic = "force-dynamic";

const AdminManager = () => {

  // Mantener la lista de administradores en el estado
  const [admins, setAdmins] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

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
      setSuccess(`Administrador creado: ${res.username}`);
      setErrorMessage("");
      setWarning("");
      setAdmins(await getAdmins());
      handleClose();
    } else {
      console.log("Error al crear el administrador:", res);
      setErrorMessage("Error al crear el administrador:\n" + res.message);
      setSuccess("");
      setWarning("");
    }
  };

  const handleDeleteAdmin = async (username: string) => {
    console.log(username);
    const res = await deleteAdmin(username);
    setWarning(`Administrador eliminado: ${res.username}`);
    setSuccess("");
    setErrorMessage("");
    setAdmins(await getAdmins());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Administradores
        </Typography>
        {errorMessage && ( // Renderiza el Alert si hay un mensaje de error
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {success && ( // Renderiza el Alert si hay un mensaje de error
          <Alert severity="success">{success}</Alert>
        )}
        {warning && ( // Renderiza el Alert si hay un mensaje de error
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
