"use client"
import { useState } from 'react';
import { Typography, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddAdminDialog from '@/components/addAdminDialog';
import AdminTable from '@/components/adminTable';

const AdminManager = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Título */}
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Administradores
        </Typography>

        {/* Botón circular para agregar administrador */}
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

      {/* Tabla de administradores */}
      <AdminTable />

      {/* Diálogo para agregar un administrador */}
      <AddAdminDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default AdminManager;
