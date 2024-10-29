import React, { useState, ChangeEvent } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { FlightData } from '@/app/schemas/flightFormSchema';

interface FlightEditFormProps {
  open: boolean;
  flight: FlightData;
  onSave: (updatedFlight: { priceEconomyClass: number; priceFirstClass: number }) => void;
  onClose: () => void;
}

const FlightEditForm: React.FC<FlightEditFormProps> = ({ open, flight, onSave, onClose }) => {
  const [editType, setEditType] = useState<'change' | 'discount'>('change');
  const [priceEconomyClass, setPriceEconomyClass] = useState<number | string>(flight.priceEconomyClass);
  const [priceFirstClass, setPriceFirstClass] = useState<number | string>(flight.priceFirstClass);
  const [discountEconomy, setDiscountEconomy] = useState<number | string>('');
  const [discountFirstClass, setDiscountFirstClass] = useState<number | string>('');

  const handleEditTypeChange = (event: SelectChangeEvent<'change' | 'discount'>) => {
    setEditType(event.target.value as 'change' | 'discount');
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setPrice: React.Dispatch<React.SetStateAction<number | string>>) => {
    const value = e.target.value;
    setPrice(value === '' ? '' : parseFloat(value));
  };

  const handleDiscountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    setDiscount: React.Dispatch<React.SetStateAction<number | string>>,
    priceClass: 'economy' | 'first'
  ) => {
    const value = e.target.value;
    const discountValue = value === '' ? '' : parseFloat(value);
    setDiscount(discountValue);

    if (editType === 'discount') {
      if (priceClass === 'economy') {
        const newPriceEconomy = discountValue ? flight.priceEconomyClass - (flight.priceEconomyClass * discountValue) / 100 : flight.priceEconomyClass;
        setPriceEconomyClass(parseFloat(newPriceEconomy.toFixed(2)));
      } else if (priceClass === 'first') {
        const newPriceFirstClass = discountValue ? flight.priceFirstClass - (flight.priceFirstClass * discountValue) / 100 : flight.priceFirstClass;
        setPriceFirstClass(parseFloat(newPriceFirstClass.toFixed(2)));
      }
    }
  };

  const handleSave = () => {
    onSave({
      priceEconomyClass: typeof priceEconomyClass === 'string' ? parseFloat(priceEconomyClass) : priceEconomyClass,
      priceFirstClass: typeof priceFirstClass === 'string' ? parseFloat(priceFirstClass) : priceFirstClass,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar vuelo: {flight.code}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Precio Actual Clase Económica"
          type="number"
          fullWidth
          variant="outlined"
          value={priceEconomyClass}
          InputProps={{
            readOnly: editType === 'discount',
          }}
          onChange={(e) => handlePriceChange(e, setPriceEconomyClass)}
        />
        <TextField
          margin="dense"
          label="Precio Actual Clase Ejecutiva"
          type="number"
          fullWidth
          variant="outlined"
          value={priceFirstClass}
          InputProps={{
            readOnly: editType === 'discount',
          }}
          onChange={(e) => handlePriceChange(e, setPriceFirstClass)}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Edición</InputLabel>
          <Select value={editType} onChange={handleEditTypeChange}>
            <MenuItem value="change">Cambiar Precio</MenuItem>
            <MenuItem value="discount">Aplicar Descuento</MenuItem>
          </Select>
        </FormControl>

        {editType === 'change' ? (
          <>
            <TextField
              margin="dense"
              label="Nuevo Precio Clase Económica"
              type="number"
              fullWidth
              variant="outlined"
              value={priceEconomyClass}
              onChange={(e) => handlePriceChange(e, setPriceEconomyClass)}
              inputProps={{ min: 0 }}
            />
            <TextField
              margin="dense"
              label="Nuevo Precio Clase Ejecutiva"
              type="number"
              fullWidth
              variant="outlined"
              value={priceFirstClass}
              onChange={(e) => handlePriceChange(e, setPriceFirstClass)}
              inputProps={{ min: 0 }}
            />
          </>
        ) : (
          <>
            <TextField
              margin="dense"
              label="Descuento (%) Clase Económica"
              type="number"
              fullWidth
              variant="outlined"
              value={discountEconomy}
              onChange={(e) => handleDiscountChange(e, setDiscountEconomy, 'economy')}
              inputProps={{ min: 0 }}
            />
            <TextField
              margin="dense"
              label="Descuento (%) Clase Ejecutiva"
              type="number"
              fullWidth
              variant="outlined"
              value={discountFirstClass}
              onChange={(e) => handleDiscountChange(e, setDiscountFirstClass, 'first')}
              inputProps={{ min: 0 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
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
