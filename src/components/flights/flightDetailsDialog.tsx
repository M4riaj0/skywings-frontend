import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';

interface Flight {
  code: string;
  creator: string;
  type: string;
  origin: string;
  destination: string;
  priceFirstClass: number;
  priceEconomyClass: number;
  departureDate1: string;
  arrivalDate1: string;
  departureDate2: string;
  arrivalDate2: string;
  creationDate: string;
  lastUpdateDate: string;
  erased: boolean;
}

interface FlightDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  flight: Flight | null;
}

const formatDateAndTime = (dateTime: string) => {
  const [date, time] = dateTime.split('T');
  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    : '';
  return { date, time: formattedTime };
};

const FlightDetailsDialog: React.FC<FlightDetailsDialogProps> = ({ open, onClose, flight }) => {
  if (!flight) return null;

  const departure1 = formatDateAndTime(flight.departureDate1);
  const arrival1 = formatDateAndTime(flight.arrivalDate1);
  const departure2 = formatDateAndTime(flight.departureDate2);
  const arrival2 = formatDateAndTime(flight.arrivalDate2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex flex-col">
          <Typography variant="h5" className="font-bold text-gray-800">
            Detalles del Vuelo
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500 italic">
            Código de Vuelo: {flight.code}
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent dividers className="bg-gray-50 p-4 sm:p-6">
        <Typography variant="h6" gutterBottom className="font-bold">
          Información General
        </Typography>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <Typography className="w-full md:w-1/2"><strong>Origen:</strong> {flight.origin}</Typography>
          <Typography className="w-full md:w-1/2"><strong>Destino:</strong> {flight.destination}</Typography>
        </div>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <Typography className="w-full md:w-1/2"><strong>Tipo de vuelo:</strong> {flight.type}</Typography>
          <Typography className="w-full md:w-1/2"><strong>Creador:</strong> {flight.creator}</Typography>
        </div>

        <Divider className="my-4" />

        <Typography variant="h6" gutterBottom className="font-bold">
          Precios
        </Typography>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <Typography className="w-full md:w-1/2"><strong>Primera Clase:</strong> ${flight.priceFirstClass}</Typography>
          <Typography className="w-full md:w-1/2"><strong>Clase Económica:</strong> ${flight.priceEconomyClass}</Typography>
        </div>

        <Divider className="my-4" />

        {/* Fechas de Salida y Llegada */}
        <Typography variant="h6" gutterBottom className="font-bold">
          Fechas y Horarios
        </Typography>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="w-full md:w-1/2">
            <Typography><strong>Fecha de Salida (Ida):</strong> {departure1.date}</Typography>
            <Typography><strong>Hora de Salida (Ida):</strong> {departure1.time}</Typography>
            <Typography><strong>Hora de Llegada (Ida):</strong> {arrival1.time}</Typography>
          </div>
          <div className="w-full md:w-1/2">
            <Typography><strong>Fecha de Salida (Vuelta):</strong> {departure2.date}</Typography>
            <Typography><strong>Hora de Salida (Vuelta):</strong> {departure2.time}</Typography>
            <Typography><strong>Hora de Llegada (Vuelta):</strong> {arrival2.time}</Typography>
          </div>
        </div>

        <Divider className="my-4" />

        <Typography variant="h6" gutterBottom className="font-bold">
          Registro
        </Typography>
        <div className="flex flex-col md:flex-row justify-between">
          <Typography><strong>Fecha de Creación:</strong> {flight.creationDate.split('T')[0]}</Typography>
          <Typography><strong>Última Actualización:</strong> {flight.lastUpdateDate.split('T')[0]}</Typography>
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} color="primary" variant="contained" className="text-white rounded-lg px-4 py-2">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightDetailsDialog;
