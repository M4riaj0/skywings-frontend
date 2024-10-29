import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { FlightData, flightUpdateSchema } from "@/app/schemas/flightFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface FlightEditFormProps {
  open: boolean;
  flight: FlightData;
  onSave: (updatedFlight: {
    priceEconomyClass: number;
    priceFirstClass: number;
  }) => void;
  onClose: () => void;
}

const FlightEditForm: React.FC<FlightEditFormProps> = ({
  open,
  flight,
  onSave,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      editType: "change",
      priceEconomyClass: flight.priceEconomyClass,
      priceFirstClass: flight.priceFirstClass,
      discountEconomy: 0,
      discountFirstClass: 0,
    },
    resolver: zodResolver(flightUpdateSchema),
  });

  const editType = watch("editType");

  const handleSave = handleSubmit((data) => {
    console.log(data);
    onSave({
      priceEconomyClass: data.priceEconomyClass,
      priceFirstClass: data.priceFirstClass,
    });
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar vuelo: {flight.code}</DialogTitle>
      <DialogContent>
        <Controller
          name="priceEconomyClass"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Precio Actual Clase Económica"
              type="number"
              fullWidth
              variant="outlined"
              {...field}
              disabled
            />
          )}
        />
        <Controller
          name="priceFirstClass"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Precio Actual Clase Ejecutiva"
              type="number"
              fullWidth
              variant="outlined"
              {...field}
              disabled
            />
          )}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Edición</InputLabel>
          <Controller
            name="editType"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Tipo de edición">
                <MenuItem value="change">Cambiar Precio</MenuItem>
                <MenuItem value="discount">Aplicar Descuento</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        {editType === "change" ? (
          <>
            <Controller
              name="priceEconomyClass"
              control={control}
              render={({ field }) => (
                <TextField
                  margin="dense"
                  label="Nuevo Precio Clase Económica"
                  type="number"
                  fullWidth
                  variant="outlined"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : "")
                  }
                  error={!!errors.priceEconomyClass}
                  helperText={errors.priceEconomyClass?.message}
                />
              )}
            />
            <Controller
              name="priceFirstClass"
              control={control}
              render={({ field }) => (
                <TextField
                  margin="dense"
                  label="Nuevo Precio Clase Ejecutiva"
                  type="number"
                  fullWidth
                  variant="outlined"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : "")
                  }
                  error={!!errors.priceFirstClass}
                  helperText={errors.priceFirstClass?.message}
                />
              )}
            />
          </>
        ) : (
          <>
            <Controller
              name="discountEconomy"
              control={control}
              render={({ field }) => (
                <TextField
                  margin="dense"
                  label="Descuento (%) Clase Económica"
                  type="number"
                  fullWidth
                  variant="outlined"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";
                    field.onChange(value);

                    const currentPrice = flight.priceEconomyClass;
                    const newPriceEconomy = value
                      ? currentPrice - (currentPrice * value) / 100
                      : currentPrice;
                    setValue(
                      "priceEconomyClass",
                      parseFloat(newPriceEconomy.toFixed(2))
                    );
                  }}
                  error={!!errors.discountEconomy}
                  helperText={errors.discountEconomy?.message}
                />
              )}
            />
            <Controller
              name="discountFirstClass"
              control={control}
              render={({ field }) => (
                <TextField
                  margin="dense"
                  label="Descuento (%) Clase Ejecutiva"
                  type="number"
                  fullWidth
                  variant="outlined"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";
                    field.onChange(value);

                    const currentPrice = flight.priceEconomyClass;
                    const newPriceEconomy = value
                      ? currentPrice - (currentPrice * value) / 100
                      : currentPrice;
                    setValue(
                      "priceEconomyClass",
                      parseFloat(newPriceEconomy.toFixed(2))
                    );
                  }}
                  error={!!errors.discountFirstClass}
                  helperText={errors.discountFirstClass?.message}
                />
              )}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancelar
        </Button>
        <Button
          type="submit"
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightEditForm;
