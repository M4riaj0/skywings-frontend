import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const schema = z.object({
  dni: z.string().min(10, "El DNI debe tener al menos 10 dígitos").nonempty("El DNI es requerido"),
  cardNumber: z.string().length(16, "El número de tarjeta debe tener 16 dígitos").nonempty("El número de tarjeta es requerido"),
  cvv: z.string().length(3, "El CVV debe tener 3 dígitos").nonempty("El CVV es requerido"),
  balance: z.preprocess((val) => Number(val), z.number().nonnegative("El balance debe ser un número no negativo").int("El balance debe ser un número entero").refine(value => value !== undefined, "El balance es requerido")),
  type: z.enum(["debit", "credit"]).refine(value => value !== undefined, { message: "El tipo de tarjeta es requerido" }),
  expirationDate: z.string().nonempty("La fecha de expiración es requerida").refine(date => {
    const today = new Date();
    const expirationDate = new Date(date);
    return expirationDate >= today;
  }, "La tarjeta ya ha expirado"),
});

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: z.infer<typeof schema>;
  onAddCard?: (data: z.infer<typeof schema>) => void;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({ open, onClose, initialData, onAddCard }) => {
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
    mode: "onChange"
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        dni: "",
        cardNumber: "",
        cvv: "",
        balance: 0,
        type: "debit",
        expirationDate: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    // print if the action is editing or adding a card
    console.log(initialData ? "Edit card" : "Add card");
    if (onAddCard) {
      onAddCard(data);
    }
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? "Editar Tarjeta" : "Agregar Tarjeta"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-2">
            <Controller name="dni" control={control} render={({ field }) => (
              <TextField {...field} label="DNI" fullWidth required error={!!errors.dni} helperText={errors.dni?.message} margin="normal" />
            )} />
            <Controller name="type" control={control} render={({ field }) => (
              <TextField {...field} label="Tipo" select fullWidth required error={!!errors.type} helperText={errors.type?.message} margin="normal">
                <MenuItem value="debit">Débito</MenuItem>
                <MenuItem value="credit">Crédito</MenuItem>
              </TextField>
            )} />
          </div>
          <Controller name="cardNumber" control={control} render={({ field }) => (
            <TextField {...field} label="Número de Tarjeta" fullWidth required error={!!errors.cardNumber} helperText={errors.cardNumber?.message} />
          )} />
            <div className="flex space-x-2">
            <Controller name="cvv" control={control} render={({ field }) => (
              <TextField {...field} label="CVV" fullWidth required error={!!errors.cvv} helperText={errors.cvv?.message} />
            )} />
            <Controller name="expirationDate" control={control} render={({ field }) => (
              <TextField {...field} label="Fecha de Expiración" type="date" fullWidth required error={!!errors.expirationDate} helperText={errors.expirationDate?.message} InputLabelProps={{ shrink: true }} />
            )} />
            </div>
          <Controller name="balance" control={control} render={({ field }) => (
            <TextField {...field} label="Balance" type="number" fullWidth required error={!!errors.balance} helperText={errors.balance?.message} />
          )} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary" disabled={!isValid}>
          {initialData ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardDialog;
