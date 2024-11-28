import React, { useState } from "react";
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
import { FlightData } from "@/schemas/flightFormSchema";
import { flightUpdateSchema } from "@/schemas/flightFormSchema";

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
  const [editType, setEditType] = useState<"change" | "discount">("change");
  const [values, setValues] = useState({
    priceEconomyClass: flight.priceEconomyClass,
    priceFirstClass: flight.priceFirstClass,
    discount: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const previusPrices = [flight.priceEconomyClass, flight.priceFirstClass];

  const handleDiscount = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseInt(e.target.value);
    const economyPrice =
      flight.priceEconomyClass - (flight.priceEconomyClass * discount) / 100;
    const firstPrice =
      flight.priceFirstClass - (flight.priceFirstClass * discount) / 100;
    setValues({
      ...values,
      priceEconomyClass: economyPrice,
      priceFirstClass: firstPrice,
      discount: discount,
    });
  };

  const handleSave = () => {
    if (previusPrices[0] === values.priceEconomyClass && previusPrices[1] === values.priceFirstClass){
      alert("Error al modificar el vuelo\nLos datos ingresados corresponden a los datos actuales")
    } else {
      const { success, data, error } = flightUpdateSchema.safeParse({...values});
      if (success) {
        setErrors({});
        onSave({
          priceEconomyClass: data.priceEconomyClass,
          priceFirstClass: data.priceFirstClass,
        });
      } else {
        const newErrors = error.issues.reduce((acc, iError) => {
          acc[iError.path[0]] = iError.message; // Mapear errores en base al primer elemento del path
          return acc;
        }, {} as { [key: string]: string });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar vuelo: {flight.code}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label= {editType === 'discount' ? "Nuevo Precio Clase Económica" : "Precio Anterior Clase Económica"}
          type="number"
          fullWidth
          variant="outlined"
          value={editType === 'discount' ? values.priceEconomyClass : previusPrices[0]}
          disabled  
        />
        <TextField
          margin="dense"
          label={editType === 'discount' ? "Nuevo Precio Primera Clase" : "Precio Anterior Primera Clase"}
          type="number"
          fullWidth
          variant="outlined"
          value={editType === 'discount' ? values.priceFirstClass : previusPrices[1]}
          disabled
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Edición</InputLabel>
          <Select
            value={editType}
            label="Tipo de Edición"
            onChange={(e) =>
              setEditType(e.target.value as "change" | "discount")
            }
          >
            <MenuItem value="change">Cambiar Precio</MenuItem>
            <MenuItem value="discount">Aplicar Descuento</MenuItem>
          </Select>
        </FormControl>

        {editType === "change" ? (
          <>
            <TextField
              margin="dense"
              label="Nuevo Precio Clase Económica"
              type="number"
              fullWidth
              variant="outlined"
              value={values.priceEconomyClass ? values.priceEconomyClass : ''}
              onChange={(e) =>
                setValues({
                  ...values,
                  priceEconomyClass: parseInt(e.target.value),
                })
              }
              error={!!errors.priceEconomyClass}
              helperText={errors.priceEconomyClass}
            />
            <TextField
              margin="dense"
              label="Nuevo Precio Primera Clase"
              type="number"
              fullWidth
              variant="outlined"
              value={values.priceFirstClass ? values.priceFirstClass : ''}
              onChange={(e) =>
                setValues({
                  ...values,
                  priceFirstClass: parseInt(e.target.value),
                })
              }
              error={!!errors.priceFirstClass}
              helperText={errors.priceFirstClass}
            />
          </>
        ) : (
          <>
            <TextField
              margin="dense"
              label="Descuento (%) Aplicado"
              type="number"
              fullWidth
              variant="outlined"
              value={values.discount ? values.discount : ''}
              onChange={handleDiscount()}
              error={!!errors.discount}
              helperText={errors.discount}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightEditForm;
