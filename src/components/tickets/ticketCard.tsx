// TicketCard.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Collapse,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import LuggageIcon from "@mui/icons-material/Luggage";
import BadgeIcon from "@mui/icons-material/Badge";

interface TicketCardProps {
  flightCode: string;
  passengerDni: string;
  username: string;
  seatNumber: number;
  price: number;
  creationDate: string;
  checkIn?: Date | null;
  numSuitcase: number;
  erased?: boolean;
  onCancel?: () => void; // Función opcional para cancelar el tiquete
  onBuy?: () => void;
  onCheckin?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  flightCode,
  passengerDni,
  seatNumber,
  price,
  creationDate,
  checkIn,
  numSuitcase,
  erased,
  onCancel,
  onBuy,
  onCheckin,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="bg-white border rounded-2xl shadow-md my-4 relative overflow-hidden">
      {/* Fondo de la tarjeta cuando se expande */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/background.png)`,
          opacity: 0.2,
          display: expanded ? "block" : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: isSmallScreen ? "center right 38%" : "center",
        }}
      ></div>

      <CardActionArea
        className={`flex ${isSmallScreen ? "flex-col items-center" : "items-center"} p-4 pl-8 pr-8 cursor-pointer ${isSmallScreen ? "px-4" : ""}`}
        onClick={handleExpandClick}
      >
        <AirplaneTicketIcon className={`text-5xl ${erased ? "text-red-500" : "text-gray-500"} ${isSmallScreen ? "mb-2" : "mr-4"} ${isSmallScreen ? "mx-2" : ""}`} />

        <CardContent className={`flex-1 ${isSmallScreen ? "text-center" : ""}`}>
          {erased && (
        <Typography variant="h6" className="font-bold text-red-500 mb-1">
          Cancelado
        </Typography>
          )}

          <Typography
        variant="h6"
        className={`font-bold ${erased ? "text-red-500" : "text-gray-800"} mb-1`}
          >
        Código de vuelo: {flightCode}
          </Typography>

          {!erased && (
        <Typography variant="body2" className="text-gray-500 mt-2">
          Fecha de compra: {new Date(creationDate).toLocaleDateString()}
        </Typography>
          )}
        </CardContent>

        <CardContent className={`flex items-center justify-center bg-gray-200 text-center px-6 rounded-lg ${isSmallScreen ? "mt-2" : ""}`}>
          <div>
        <Typography variant="body2" className="text-gray-500 text-sm">
          Precio
        </Typography>
        <Typography variant="h6" className="font-bold text-gray-800">
          {price.toLocaleString()} COP
        </Typography>
          </div>
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className="flex flex-col space-y-4 p-6 bg-gray-50 rounded-b-2xl">
          <Box className="flex items-center space-x-3">
            <FlightClassIcon className="text-4xl text-gray-600" />
            <Typography variant="body1" className="font-medium text-gray-700">
              Asiento: {seatNumber}
            </Typography>
          </Box>

          <Box className="flex items-center space-x-3">
            <BadgeIcon className="text-4xl text-blue-600" />
            <Typography variant="body1" className="font-medium text-gray-700">
              DNI Pasajero: {passengerDni.trim()}
            </Typography>
          </Box>

          <Box className="flex items-center space-x-3">
            <LuggageIcon className="text-4xl text-gray-600" />
            <Typography variant="body1" className="font-medium text-gray-700">
              Maletas: {numSuitcase}
            </Typography>
          </Box>

          <Box className="flex items-center space-x-3">
            <Typography variant="body1" className="font-medium text-gray-700">
              Check-In:{" "}
              <span className="font-bold">
                {checkIn ? new Date(checkIn).toLocaleString() : "No"}
              </span>
            </Typography>
          </Box>

          {onCancel && !erased && !checkIn && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                className="bg-white text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                onClick={() => {
                  onCancel();
                  setExpanded(false);
                }}
              >
                Cancelar Tiquete
              </Button>
            </Box>
          )}

          {onBuy && !erased && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                className="bg-blue-500 text-white hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  onBuy();
                  setExpanded(false);
                }}
              >
                Comprar Tiquete
              </Button>
            </Box>
          )}

          {onCheckin && !erased && !checkIn && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                className="bg-green-500 text-white hover:bg-green-700 transition duration-200"
                onClick={() => {
                  onCheckin();
                  // setExpanded(false);
                }}
              >
                Hacer check-in
              </Button>
            </Box>
          )}
        </CardContent>
      </Collapse>

      {erased && (
        <>
          <div className={`absolute top-0 left-0 w-4 h-full bg-red-500 rounded-l-full`}></div>
          <div className={`absolute top-0 right-0 w-4 h-full bg-red-500 rounded-r-full`}></div>
        </>
      )}
      {!erased && (
        <>
          <div className={`absolute top-0 left-0 w-4 h-full bg-gray-300 rounded-l-full`}></div>
          <div className={`absolute top-0 right-0 w-4 h-full bg-gray-300 rounded-r-full`}></div>
        </>
      )}
    </Card>
  );
};

export default TicketCard;
