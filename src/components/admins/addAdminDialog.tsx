import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { getAllUsers } from "@/services/admins";

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAdmin: (newAdmin: { username: string; email: string }) => void;
}

export default function AddAdminDialog({ open, onClose, onAddAdmin }: AddAdminDialogProps) {
  const [admins, setAdmins] = useState<{ username: string; email: string }[]>([]);
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsList = await getAllUsers();
      setAdmins(adminsList);
    };

    fetchAdmins();
  }, []);

  const validateAsync = async (value: string, field: 'username' | 'email') => {
    if (field === 'username') {
      const exists = admins.some(admin => admin.username === value);
      setUsernameError(exists ? "Este nombre de usuario ya está en uso" : "");
    } else if (field === 'email') {
      // Comprobar si el correo ya está en uso
      const exists = admins.some(admin => admin.email === value);
      setEmailError(exists ? "Este correo ya está registrado" : "");
    }
  };

  const schema = z.object({
    username: z.string()
      .min(5, { message: "El nombre de usuario debe tener al menos 5 caracteres" })
      .max(20, { message: "El nombre de usuario no puede tener más de 20 caracteres" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario solo puede contener letras, números y guiones bajos" }),
    email: z.string().email({ message: "El email no es válido" })
      .max(60, { message: "El email no puede tener más de 60 caracteres" })
      .nonempty({ message: "El email no puede estar vacío" })
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: { username: string; email: string }) => {
    console.log("Handle submit", data); 
    onAddAdmin(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Agregar Administrador</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de Usuario"
                fullWidth
                margin="dense"
                error={!!errors.username || !!usernameError}
                helperText={errors.username ? errors.username.message : usernameError}
                onBlur={() => validateAsync(field.value, 'username')}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="dense"
                error={!!errors.email || !!emailError}
                helperText={errors.email ? errors.email.message : emailError}
                onBlur={() => validateAsync(field.value, 'email')}
              />
            )}
          />
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              className="bg-white text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!!usernameError || !!emailError}
              style={{ opacity: 1 }}
            >
              Agregar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
