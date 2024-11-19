"use client";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { FlightData } from "@/app/schemas/flightFormSchema";
import { CartContext } from "@/context/cart";
import { useContext, useState } from "react";

interface ClassCardProps {
  flight: FlightData;
  type: string;
  classType: string;
  price: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ flight, type, classType, price }) => {
  const [cartMessage, setCartMessage] = useState<string>("");
  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartContext must be used within a CartProvider");
  const { state, dispatch } = cartContext;

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
  return (
    <Card
      className="border flex justify-between px-5 py-3"
      sx={{ backgroundColor: "background.default" }}
    >
      <CardContent>
        {cartMessage && (
          <Alert
            severity={`${cartMessage.startsWith("¡No") ? "error" : "info"}`}
            className="mb-3"
          >
            {cartMessage}
          </Alert>
        )}
        <Typography variant="h5" component="div">
          {classType == "Primera" ? "Primera Clase" : "Clase Económica"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Precio: ${price}
        </Typography>
      </CardContent>
      <CardActions>
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
