import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  DialogProps,
} from "@mui/material";
import { FlightData } from "@/app/schemas/flightFormSchema";

interface FlightDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  flight: FlightData | null;
}

const formatDateAndTime = (dateTime: string) => {
  const [date, time] = dateTime.split("T");
  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "";
  return { date, time: formattedTime };
};

const FlightDetailsDialog: React.FC<FlightDetailsDialogProps> = ({
  open,
  onClose,
  flight,
}) => {
  const [scroll, ] = React.useState<DialogProps['scroll']>('paper');

  if (!flight) return null;

  const departure1 = formatDateAndTime(flight.departureDate1);
  const arrival1 = formatDateAndTime(flight.arrivalDate1);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll={scroll}>
      <DialogTitle>
        <Box className="flex flex-col">
          <Typography className="text-2xl font-bold text-gray-800">
            Detalles del Vuelo 
          </Typography>
          <Typography className="text-sm text-gray-500 italic">
            Código de Vuelo: {flight.code}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="mb-4">
          <img src="/images/flight.png" alt="Flight Image" className="w-full max-h-52 object-cover" />
        </Box>
        
        {/* Información General */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Información General
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography><span className="font-medium">Origen:</span> {flight.origin}</Typography>
            <Typography><span className="font-medium">Destino:</span> {flight.destination}</Typography>
          </Box>
          <Box className="flex flex-col md:flex-row justify-between mt-2">
            <Typography><span className="font-medium">Tipo de vuelo:</span> {flight.type === 'national' ? 'Nacional' : 'Internacional'}</Typography>
            <Typography><span className="font-medium">Creador:</span> {flight.creator}</Typography>
          </Box>
        </Paper>

        {/* Precios */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Precios
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography><span className="font-medium">Primera Clase:</span> ${flight.priceFirstClass}</Typography>
            <Typography><span className="font-medium">Clase Económica:</span> ${flight.priceEconomyClass}</Typography>
          </Box>
        </Paper>

        {/* Fechas y Horarios */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Fechas y Horarios
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Box>
              <Typography><span className="font-medium">Fecha de Salida (Ida):</span> {departure1.date}</Typography>
              <Typography><span className="font-medium">Hora de Salida (Ida):</span> {departure1.time}</Typography>
              <Typography><span className="font-medium">Hora de Llegada (Ida):</span> {arrival1.time}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Registro */}
        <Paper elevation={3} className="p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Registro
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography><span className="font-medium">Fecha de Creación:</span> {flight.creationDate.split("T")[0]}</Typography>
            <Typography><span className="font-medium">Última Actualización:</span> {flight.lastUpdateDate.split("T")[0]}</Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightDetailsDialog;
