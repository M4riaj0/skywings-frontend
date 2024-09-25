import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAdminDialog({ open, onClose }: AddAdminDialogProps) {
  const [adminData, setAdminData] = useState({ name: "", email: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = () => {
    // Lógica para agregar el administrador
    console.log("Agregar admin:", adminData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Administrador</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={adminData.name}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Email"
          name="email"
          value={adminData.email}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
