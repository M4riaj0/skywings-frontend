import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const schema = z.object({
  propietary: z.string().nonempty("El DNI es requerido"),
  number: z
    .string()
    .length(16, "El número de tarjeta debe tener 16 dígitos")
    .nonempty("El número de tarjeta es requerido"),
  cvv: z
    .string()
    .length(3, "El CVV debe tener 3 dígitos")
    .nonempty("El CVV es requerido"),
  balance: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .int("El balance debe ser un número entero")
      .min(1001, "El balance debe ser mayor a 1000")
      .refine((value) => value !== undefined, "El balance es requerido")
  ),
  type: z
    .enum(["debit", "credit"])
    .refine((value) => value !== undefined, {
      message: "El tipo de tarjeta es requerido",
    }),
  expirationDate: z
    .string()
    .nonempty("La fecha de expiración es requerida")
    .datetime({ offset: true })
    .refine((date) => {
      const today = new Date();
      const expirationDate = new Date(date);
      return expirationDate >= today;
    }, "La tarjeta ya ha expirado"),
});

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: z.infer<typeof schema>;
  editing: boolean;
  onSubmit: (data: z.infer<typeof schema>) => void;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({
  open,
  onClose,
  initialData,
  editing,
  onSubmit,
}) => {
  const [dniFromToken, setDniFromToken] = useState<string>("");
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      propietary: "", 
      number: "",
      cvv: "",
      balance: 0,
      type: "debit",
      expirationDate: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    console.log("useEffect ejecutado");

    if (initialData) {
      reset(initialData);
    } else {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setDniFromToken(decodedToken.dni || "");
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, [initialData, reset, open]);

  useEffect(() => {
    if (!initialData) {
      reset({
        propietary: dniFromToken, 
        number: "", 
        cvv: "", 
        balance: 0,
        type: "debit", 
        expirationDate: "",
      });
    }
  }, [dniFromToken, initialData, reset]);

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    onSubmit(data);
    onClose();
    reset();
  };

  const handleCancel = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>
        {editing ? "Editar Saldo" : "Agregar Tarjeta"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="flex space-x-2">
            <Controller
              name="propietary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="DNI"
                  fullWidth
                  required
                  error={!!errors.propietary}
                  helperText={errors.propietary?.message}
                  margin="normal"
                  disabled
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo"
                  select
                  fullWidth
                  required
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  margin="normal"
                  disabled={editing}
                >
                  <MenuItem value="debit">Débito</MenuItem>
                  <MenuItem value="credit">Crédito</MenuItem>
                </TextField>
              )}
            />
          </div>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de Tarjeta"
                type="number"
                fullWidth
                required
                error={!!errors.number}
                helperText={errors.number?.message}
                disabled={editing}
              />
            )}
          />
          <div className="flex space-x-2">
            <Controller
              name="cvv"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CVV"
                  type="password"
                  slotProps={{ htmlInput: { maxLength: 3, minLength: 3, inputMode: "numeric", pattern: "[0-9]*" } }}
                  fullWidth
                  required
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                  error={!!errors.cvv}
                  helperText={errors.cvv?.message}
                  disabled={editing}
                />
              )}
            />
            <Controller
              name="expirationDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Expiración"
                  type="month"
                  fullWidth
                  required
                  error={!!errors.expirationDate}
                  helperText={errors.expirationDate?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                  disabled={editing}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                  value={field.value ? field.value.slice(0, 7) : ""}
                />
              )}
            />
          </div>
          <Controller
            name="balance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Balance"
                type="number"
                fullWidth
                required
                error={!!errors.balance}
                helperText={errors.balance?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          variant="contained"
          className="bg-white text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
          {editing ? "Guardar Cambios" : "Agregar Tarjeta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardDialog;
