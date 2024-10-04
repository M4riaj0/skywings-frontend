// import { Password } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAdmin: (newAdmin: {  username: string; email: string, password: string }) => void; // Cambiar aquí
}

export default function AddAdminDialog({ open, onClose, onAddAdmin }: AddAdminDialogProps) {
  const [adminData, setAdminData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: false, email: false, password: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
    setErrors({ ...errors, [name]: !value }); // Verifica si el campo está vacío
  };

  const handleSubmit = () => {
    // Validar campos obligatorios
    const newErrors = {
      username: !adminData.username,
      email: !adminData.email,
      password: !adminData.password,
    };
    setErrors(newErrors);

    if (!newErrors.username && !newErrors.email && !newErrors.password) {
      // Lógica para agregar el administrador
      const newAdmin = { username: adminData.username, email: adminData.email, password: adminData.password }; // Generar un id único
      onAddAdmin(newAdmin); // Llamar a la función para agregar el administrador
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Agregar Administrador</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre de Usuario"
          name="username"
          value={adminData.username}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          error={errors.username}
          helperText={errors.username ? "Este campo es obligatorio" : ""}
        />
        <TextField
          label="Email"
          name="email"
          value={adminData.email}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          error={errors.email}
          helperText={errors.email ? "Este campo es obligatorio" : ""}
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={adminData.password}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          error={errors.password}
          helperText={errors.password ? "Este campo es obligatorio" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained" 
          style={{ backgroundColor: 'white', color: 'red', opacity: 1 }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          style={{ opacity: 1 }}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
