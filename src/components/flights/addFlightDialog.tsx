import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFlightDialogProps {
  open: boolean;
  onClose: () => void;
  onAddFlight: (newFlight: {
    code: string;
    origin: string;
    destination: string;
    departureDate1: string;
    arrivalDate1: string;
    departureDate2: string;
    arrivalDate2: string;
    priceFirstClass: number;
    priceEconomyClass: number;
  }) => void;
}

export default function AddFlightDialog({ open, onClose, onAddFlight }: AddFlightDialogProps) {
  const schema = z.object({
    code: z.string()
      .min(3, { message: "El código del vuelo debe tener al menos 3 caracteres" })
      .max(10, { message: "El código del vuelo no puede tener más de 10 caracteres" }),
    origin: z.string().nonempty({ message: "El origen es obligatorio" }),
    destination: z.string().nonempty({ message: "El destino es obligatorio" }),
    departureDate1: z.string().nonempty({ message: "La fecha de salida (ida) es obligatoria" }),
    arrivalDate1: z.string().nonempty({ message: "La hora de llegada (ida) es obligatoria" }),
    departureDate2: z.string().nonempty({ message: "La fecha de salida (vuelta) es obligatoria" }),
    arrivalDate2: z.string().nonempty({ message: "La hora de llegada (vuelta) es obligatoria" }),
    priceFirstClass: z.number().min(0, { message: "El precio de primera clase debe ser un número positivo" }),
    priceEconomyClass: z.number().min(0, { message: "El precio de clase económica debe ser un número positivo" }),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      code: "",
      origin: "",
      destination: "",
      departureDate1: "",
      arrivalDate1: "",
      departureDate2: "",
      arrivalDate2: "",
      priceFirstClass: 0,
      priceEconomyClass: 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: {
    code: string;
    origin: string;
    destination: string;
    departureDate1: string;
    arrivalDate1: string;
    departureDate2: string;
    arrivalDate2: string;
    priceFirstClass: number;
    priceEconomyClass: number;
  }) => {
    const combinedData = {
      ...data,
      departureDate1: `${data.departureDate1}T${data.arrivalDate1}`, // Combina fecha y hora de salida (ida)
      arrivalDate1: `${data.departureDate1}T${data.arrivalDate1}`, // Combina fecha y hora de llegada (ida)
      departureDate2: `${data.departureDate2}T${data.arrivalDate2}`, // Combina fecha y hora de salida (vuelta)
      arrivalDate2: `${data.departureDate2}T${data.arrivalDate2}`, // Combina fecha y hora de llegada (vuelta)
    };
    onAddFlight(combinedData);
    onClose();
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Agregar Vuelo</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código de Vuelo"
                fullWidth
                margin="dense"
                error={!!errors.code}
                helperText={errors.code ? errors.code.message : ""}
              />
            )}
          />
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Origen"
                fullWidth
                margin="dense"
                error={!!errors.origin}
                helperText={errors.origin ? errors.origin.message : ""}
              />
            )}
          />
          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Destino"
                fullWidth
                margin="dense"
                error={!!errors.destination}
                helperText={errors.destination ? errors.destination.message : ""}
              />
            )}
          />
          <Controller
            name="departureDate1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Salida (Ida)"
                type="date"
                fullWidth
                margin="dense"
                error={!!errors.departureDate1}
                helperText={errors.departureDate1 ? errors.departureDate1.message : ""}
              />
            )}
          />
          <Controller
            name="arrivalDate1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hora de Llegada (Ida)"
                type="time"
                fullWidth
                margin="dense"
                error={!!errors.arrivalDate1}
                helperText={errors.arrivalDate1 ? errors.arrivalDate1.message : ""}
              />
            )}
          />
          <Controller
            name="departureDate2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Salida (Vuelta)"
                type="date"
                fullWidth
                margin="dense"
                error={!!errors.departureDate2}
                helperText={errors.departureDate2 ? errors.departureDate2.message : ""}
              />
            )}
          />
          <Controller
            name="arrivalDate2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hora de Llegada (Vuelta)"
                type="time"
                fullWidth
                margin="dense"
                error={!!errors.arrivalDate2}
                helperText={errors.arrivalDate2 ? errors.arrivalDate2.message : ""}
              />
            )}
          />
          <Controller
            name="priceFirstClass"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio Primera Clase"
                type="number"
                fullWidth
                margin="dense"
                error={!!errors.priceFirstClass}
                helperText={errors.priceFirstClass ? errors.priceFirstClass.message : ""}
              />
            )}
          />
          <Controller
            name="priceEconomyClass"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio Clase Económica"
                type="number"
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
            >
              Agregar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
