import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditFlightDialogProps {
  open: boolean;
  onClose: () => void;
  onEditFlight: (newFlight: { code: string; priceFirstClass: number; priceEconomyClass: number }) => void;
}

export default function EditFlightDialog({ open, onClose, onEditFlight }: EditFlightDialogProps) {
  const schema = z.object({
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      code: "",
      priceFirstClass: 0,
      priceEconomyClass: 0
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: { code: string; priceFirstClass: number; priceEconomyClass: number  }) => {
    onEditFlight(data);
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
            name="code"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de Usuario"
                fullWidth
                margin="dense"
                error={!!errors.code}
                helperText={errors.code ? errors.code.message : ""}
              />
            )}
          />
          <Controller
            name="priceFirstClass"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio primera clase"
                fullWidth
                type="number"
                margin="dense"
                error={!!errors.priceFirstClass}
                helperText={errors.priceFirstClass ? errors.priceFirstClass.message : ""}
              />
            )}
          />
          <Controller
            name="priceEconomyClass"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio clase económica"
                type="priceEconomyClass"
                fullWidth
                margin="dense"
                error={!!errors.priceEconomyClass}
                helperText={errors.priceEconomyClass ? errors.priceEconomyClass.message : ""}
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
