import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const schema = z.object({
  dni: z.string().min(10, "El DNI debe tener al menos 10 dígitos"),
  cardNumber: z.string().length(16, "El número de tarjeta debe tener 16 dígitos"),
  cvv: z.string().length(3, "El CVV debe tener 3 dígitos"),
  balance: z.number().positive("El balance debe ser un número positivo"),
  type: z.enum(["debit", "credit"]),
  expirationDate: z.string(),
});

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: z.infer<typeof schema>;
  onAddCard?: (data: z.infer<typeof schema>) => void;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({ open, onClose, initialData }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {}
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data: z.infer<typeof schema>) => {
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
              <TextField {...field} label="DNI" fullWidth error={!!errors.dni} helperText={errors.dni?.message} />
            )} />
            <Controller name="type" control={control} render={({ field }) => (
              <TextField {...field} label="Tipo" select fullWidth error={!!errors.type} helperText={errors.type?.message}>
                <MenuItem value="debit">Débito</MenuItem>
                <MenuItem value="credit">Crédito</MenuItem>
              </TextField>
            )} />
          </div>
          <Controller name="cardNumber" control={control} render={({ field }) => (
            <TextField {...field} label="Número de Tarjeta" fullWidth error={!!errors.cardNumber} helperText={errors.cardNumber?.message} />
          )} />
          <div className="flex space-x-2">
            <Controller name="cvv" control={control} render={({ field }) => (
              <TextField {...field} label="CVV" fullWidth error={!!errors.cvv} helperText={errors.cvv?.message} />
            )} />
            <Controller name="expirationDate" control={control} render={({ field }) => (
              <TextField {...field} label="Fecha de Expiración" fullWidth error={!!errors.expirationDate} helperText={errors.expirationDate?.message} />
            )} />
          </div>
          <Controller name="balance" control={control} render={({ field }) => (
            <TextField {...field} label="Balance" fullWidth error={!!errors.balance} helperText={errors.balance?.message} />
          )} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {initialData ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardDialog;
