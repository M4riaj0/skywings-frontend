import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAdmin: (newAdmin: { username: string; email: string; password: string }) => void;
}

export default function AddAdminDialog({ open, onClose, onAddAdmin }: AddAdminDialogProps) {
  const schema = z.object({
    username: z.string()
      .min(5, { message: "El nombre de usuario debe tener al menos 5 caracteres" })
      .max(20, { message: "El nombre de usuario no puede tener más de 20 caracteres" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario solo puede contener letras, números y guiones bajos" }),
    email: z.string().email({ message: "El email no es válido" })
      .max(60, { message: "El email no puede tener más de 60 caracteres" })
      .nonempty({ message: "El email no puede estar vacío" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .max(20, { message: "La contraseña no puede tener más de 20 caracteres" })
      .regex(/^\S*$/, { message: "La contraseña no puede contener espacios en blanco" })
  });

  const { control, handleSubmit, getValues, formState: { errors }, reset, setError } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: { username: string; email: string; password: string }) => {
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
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
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
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contraseña"
                type="password"
                fullWidth
                margin="dense"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
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
