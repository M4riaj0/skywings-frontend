import React from "react";
import Image from "next/image";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useEffect } from "react";
import { FlightData, FlightSeatData } from "@/schemas/flightFormSchema";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDateAndTime } from "@/services/cities";
import { getFlightSeats } from "@/services/flights";

interface FlightDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  flight: FlightData | null;
}

const FlightDetailsDialog: React.FC<FlightDetailsDialogProps> = ({
  open,
  onClose,
  flight,
}) => {
  const [scroll] = React.useState<DialogProps["scroll"]>("paper");
  const [flightSeats, setFlightSeats] = React.useState<FlightSeatData>();

  useEffect(() => {
    if (!flight) return;
    const fetchFlightSeats = async () => {
      const seats = await getFlightSeats(flight.code);
      console.log(seats);
      setFlightSeats(seats);
    };

    fetchFlightSeats();
  }, [flight]);

  if (!flight) return null;
  const departure1 = formatDateAndTime(flight.origin, flight.departureDate1);
  const arrival1 = formatDateAndTime(flight.destination, flight.arrivalDate1);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll={scroll}
    >
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
        <Image
          src="/images/flight.png"
          alt="Flight Image"
          width={700}
          height={300}
          className="w-full max-h-52 object-cover"
        />

        {/* Información General */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Información General
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between mt-2">
            <Typography>
              <span className="font-medium">Tipo de vuelo:</span>{" "}
              {flight.type === "national" ? "Nacional" : "Internacional"}
            </Typography>
          </Box>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography>
              <span className="font-medium">Origen:</span> {flight.origin}
            </Typography>
            <Typography>
              <span className="font-medium">Destino:</span> {flight.destination}
            </Typography>
          </Box>
        </Paper>

        {/* Asientos */}
        <Paper elevation={3} className="mb-4 py-2">
          <Accordion elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              className="text-lg font-semibold text-gray-700"
            >
              Asientos
            </AccordionSummary>
            <AccordionDetails className="grid grid-cols-2">
              <Typography className="font-bold">
                N° de asientos primera clase
              </Typography>
              <Typography className="font-bold">
                N° de asientos clase turista
              </Typography>

              <Typography className="font-medium">
                Ocupados: {flightSeats?.busyFirst != "" ? flightSeats?.busyFirst.split(",").length : 0}
              </Typography>
              <Typography className="font-medium">
                Ocupados: {flightSeats?.busyTourist != "" ? flightSeats?.busyTourist.split(",").length : 0}
              </Typography>

              <Typography className="font-medium">
                Libres: {flightSeats?.avaliableFirst != "" ? flightSeats?.avaliableFirst.split(",").length : 0}
              </Typography>
              <Typography className="font-medium">
                Libres: {flightSeats?.avaliableTourist != "" ? flightSeats?.avaliableTourist.split(",").length : 0}
              </Typography>

              <Typography className="font-medium">
                Total: {flightSeats?.totalFirst}
              </Typography>
              <Typography className="font-medium">
                Total: {flightSeats?.totalTourist}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Precios */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Precios
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography>
              <span className="font-medium">Primera Clase:</span> $
              {flight.priceFirstClass}
            </Typography>
            <Typography>
              <span className="font-medium">Clase Económica:</span> $
              {flight.priceEconomyClass}
            </Typography>
          </Box>
        </Paper>

        {/* Fechas y Horarios */}
        <Paper elevation={3} className="mb-4 p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Fechas y Horarios
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Box className="flex flex-col">
              <Box className="flex flex-row items-center">
                <Typography className="font-medium w-40">
                  Fecha de Salida :
                </Typography>
                <Typography className="w-32">{departure1.date}</Typography>
                <Typography className="font-medium w-40">
                  Hora de Salida :
                </Typography>
                <Typography>{departure1.time}</Typography>
              </Box>
              <Box className="flex flex-row items-center mt-2">
                <Typography className="font-medium w-40">
                  Fecha de Llegada :
                </Typography>
                <Typography className="w-32">{arrival1.date}</Typography>
                <Typography className="font-medium w-40">
                  Hora de Llegada :
                </Typography>
                <Typography>{arrival1.time}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Registro */}
        <Paper elevation={3} className="p-4">
          <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            Registro
          </Typography>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography>
              <span className="font-medium">Fecha de Creación:</span>{" "}
              {flight.creationDate.split("T")[0]}
            </Typography>
            <Typography>
              <span className="font-medium">Última Actualización:</span>{" "}
              {flight.lastUpdateDate.split("T")[0]}
            </Typography>
          </Box>
          <Box className="flex flex-col md:flex-row justify-between">
            <Typography>
              <span className="font-medium">Creado por:</span> {flight.creator}
            </Typography>
            <Typography>
              <span className="font-medium">Actualizado por:</span>{" "}
              {flight.updater}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightDetailsDialog;
