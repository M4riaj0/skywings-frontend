"use client";
import { useState } from 'react';
import { Typography, Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddAdminDialog from '@/components/addAdminDialog';
import AdminTable from '@/components/adminTable';

const AdminManager = () => {
  // Mantener la lista de administradores en el estado
  const [admins, setAdmins] = useState([
    { id: 1, username: 'juan.lopez', email: 'juan.lopez@example.com' },
    { id: 2, username: 'maria.medina', email: 'maria.medina@example.com' },
    { id: 3, username: 'andres.palacio', email: 'andres.palacio@example.com' },
  ]);

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
  const handleAddAdmin = (newAdmin: Admin) => {


    setAdmins((prevAdmins) => [
      ...prevAdmins, 
      { ...newAdmin, id: prevAdmins.length ? prevAdmins[prevAdmins.length - 1].id + 1 : 1 }
    ]);
    console.log("Nuevo administrador creado:", newAdmin); 
    handleClose();
  };

  // Función para eliminar un administrador
  const handleDeleteAdmin = (username: string) => {
    setAdmins((prevAdmins) => prevAdmins.filter(admin => admin.username !== username));
    console.log("Administrador eliminado:", username); // Imprimir en consola el username del admin eliminado
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Administradores
        </Typography>

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

      <AddAdminDialog open={open} onClose={handleClose} onAddAdmin={handleAddAdmin} />
    </div>
  );
};

export default AdminManager;
