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
const cityTimeZoneMap: { [key: string]: string } = {
    "Madrid, España": "Europe/Madrid",
    "Londres, Reino Unido": "Europe/London",
    "New York, Estados Unidos": "America/New_York",
    "Buenos Aires, Argentina": "America/Argentina/Buenos_Aires",
    "Miami, Estados Unidos": "America/New_York",
    "Bogotá, Colombia": "America/Bogota", // Asumiendo Bogotá para vuelos nacionales en Colombia
};
const formatDateAndTime = (city: string, dateTime: string) => {
    const modifiedCity = city.includes("Colombia") ? `Bogotá, Colombia` : city;
    const timeZone = cityTimeZoneMap[modifiedCity];
    const [date, time] = dateTime.split("T");
    const formattedTime = time
        ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZone: timeZone,
          })
        : "";
    return { date, time: formattedTime };
};

const FlightDetailsDialog: React.FC<FlightDetailsDialogProps> = ({
    open,
    onClose,
    flight,
}) => {
    const [scroll] = React.useState<DialogProps["scroll"]>("paper");

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
                <Box className="mb-4">
                    <img
                        src="/images/flight.png"
                        alt="Flight Image"
                        className="w-full max-h-52 object-cover"
                    />
                </Box>

                {/* Información General */}
                <Paper elevation={3} className="mb-4 p-4">
                    <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
                        Información General
                    </Typography>
                    <Box className="flex flex-col md:flex-row justify-between">
                        <Typography>
                            <span className="font-medium">Origen:</span>{" "}
                            {flight.origin}
                        </Typography>
                        <Typography>
                            <span className="font-medium">Destino:</span>{" "}
                            {flight.destination}
                        </Typography>
                    </Box>
                    <Box className="flex flex-col md:flex-row justify-between mt-2">
                        <Typography>
                            <span className="font-medium">Tipo de vuelo:</span>{" "}
                            {flight.type === "national"
                                ? "Nacional"
                                : "Internacional"}
                        </Typography>
                        <Typography>
                            <span className="font-medium">Creador:</span>{" "}
                            {flight.creator}
                        </Typography>
                    </Box>
                </Paper>

                {/* Precios */}
                <Paper elevation={3} className="mb-4 p-4">
                    <Typography className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
                        Precios
                    </Typography>
                    <Box className="flex flex-col md:flex-row justify-between">
                        <Typography>
                            <span className="font-medium">Primera Clase:</span>{" "}
                            ${flight.priceFirstClass}
                        </Typography>
                        <Typography>
                            <span className="font-medium">
                                Clase Económica:
                            </span>{" "}
                            ${flight.priceEconomyClass}
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
                                <Typography className="w-32">
                                    {departure1.date}
                                </Typography>
                                <Typography className="font-medium w-40">
                                    Hora de Salida :
                                </Typography>
                                <Typography>{departure1.time}</Typography>
                            </Box>
                            <Box className="flex flex-row items-center mt-2">
                                <Typography className="font-medium w-40">
                                    Fecha de Llegada :
                                </Typography>
                                <Typography className="w-32">
                                    {arrival1.date}
                                </Typography>
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
                            <span className="font-medium">
                                Fecha de Creación:
                            </span>{" "}
                            {flight.creationDate.split("T")[0]}
                        </Typography>
                        <Typography>
                            <span className="font-medium">
                                Última Actualización:
                            </span>{" "}
                            {flight.lastUpdateDate.split("T")[0]}
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
