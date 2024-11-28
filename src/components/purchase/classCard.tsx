"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
} from "@mui/material";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import LuggageIcon from "@mui/icons-material/Luggage";
import PaidIcon from "@mui/icons-material/Paid";
import { FlightData } from "@/schemas/flightFormSchema";
import { useCartContext } from "@/context/cart";
import { useState } from "react";

interface ClassCardProps {
  flight: FlightData;
  type: string;
  classType: string;
  price: number;
}

const ClassCard: React.FC<ClassCardProps> = ({
  flight,
  type,
  classType,
  price,
}) => {
  const [cartMessage, setCartMessage] = useState<string>("");
  const { state, dispatch } = useCartContext();

  const handleAddToCart = () => {
    dispatch({
      type: "CHECK_CART",
    });
    const newItem = {
      flight: {
        code: flight.code,
        departure: flight.origin,
        arrival: flight.destination,
        departureDate: flight.departureDate1,
        arrivalDate: flight.arrivalDate1,
      },
      tickets: [
        {
          flightCode: flight.code,
          type: type,
          class: classType,
          price: price,
          passenger: {
            dni: "",
            name1: "",
            surname1: "",
            birthDate: new Date(),
            gender: "",
            phone: "",
            email: "",
            contactName: "",
            contactPhone: "",
          },
        },
      ],
    };
    const existItem = state.cart.find(
      (item) => item.flight.code === newItem.flight.code
    );
    if (existItem) {
      if (newItem.tickets.length + existItem.tickets.length <= 5) {
        for (let i = 0; i < newItem.tickets.length; i++) {
          existItem.tickets.push(newItem.tickets[i]);
        }
        dispatch({
          type: "ADD_TO_CART",
          payload: existItem,
        });
      } else {
        setCartMessage("¡No puedes agregar más de 5 tickets por vuelo!");
        return;
      }
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: newItem,
      });
    }
    setCartMessage("¡Agregado al carrito!");
  };

  // Asignación de estilos según la clase
  const isFirstClass = classType === "First";
  const cardStyles = {
    backgroundColor: isFirstClass ?  "#f3e5f5": "#e3f2fd", // Fondo azul claro para primera clase, púrpura claro para económica
    borderColor: isFirstClass ?  "#ab47bc" : "#42a5f5", // Borde azul para primera clase, púrpura para económica
    borderWidth: "2px",
    borderStyle: "solid",
  };

  return (
    <Card
      className="border flex justify-between px-5 py-3"
      sx={{ ...cardStyles }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          {isFirstClass ? "Primera Clase" : "Clase Económica"}
        </Typography>
        <Box className="flex items-center space-x-3">
          <LuggageIcon className="text-4xl text-gray-600" />
          <Typography variant="body1" className="font-medium text-gray-700">
            Maletas: {isFirstClass ? "2" : "1"}
          </Typography>
        </Box>
        <Box className="flex items-center space-x-3">
          <FlightClassIcon className="text-4xl text-gray-600" />
          <Typography variant="body1" className="font-medium text-gray-700">
            Asiento: {isFirstClass ? "Comfort" : "Estándar"}
          </Typography>
        </Box>
        <Box className="flex items-center space-x-3">
          <PaidIcon className="text-4xl text-gray-600" />
          <Typography variant="body1" className="font-medium text-gray-700">
            Precio: ${price}
          </Typography>
        </Box>
      </CardContent>
      <CardActions className="flex flex-col justify-center">
        {cartMessage && (
          <Alert
            severity={`${cartMessage.startsWith("¡No") ? "error" : "success"}`}
            className="mb-3"
          >
            {cartMessage}
          </Alert>
        )}
        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={handleAddToCart}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ClassCard;
