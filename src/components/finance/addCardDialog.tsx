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
import { useEffect } from "react";

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
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      const token = localStorage.getItem("token");
      let propietary = "";
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          propietary = decodedToken.dni || "";
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      reset({
        propietary,
        number: "",
        cvv: "",
        balance: 0,
        type: "debit",
        expirationDate: "",
      });
    }
  }, [initialData, reset]);

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
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
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
                  type="number"
                  fullWidth
                  required
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
                  type="month" // Cambiamos el tipo de entrada a 'month'
                  fullWidth
                  required
                  error={!!errors.expirationDate}
                  helperText={errors.expirationDate?.message}
                  InputLabelProps={{ shrink: true }}
                  disabled={editing}
                  onChange={(e) => {
                    const [year, month] =
                      e.target.value.split("-");
                    const isoDate = new Date(
                      Number(year),
                      Number(month) - 1,
                      1,
                      0,
                      0,
                      0
                    ).toISOString(); // Establece día 1 y hora 00:00
                    field.onChange(isoDate);
                  }}
                  value={
                    field.value
                      ? new Date(field.value)
                          .toISOString()
                          .slice(0, 7) // Muestra solo año y mes
                      : ""
                  }
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
          color="primary"
          variant="contained"
          disabled={!isValid}
        >
          {editing ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardDialog;
