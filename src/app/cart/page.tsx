"use client";

import { useCartContext } from "@/context/cart";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Flight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBook } from "@/services/purchase";

const CartPage = () => {
  const { state, dispatch } = useCartContext();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleTicketsCreation() {
    const res = await createBook(state.cart);
    console.log(res);
    if (res?.statusCode == 400 || res?.statusCode == 500) {
      console.error("Error creating tickets:", res);
      setError(
        `Error la generación de la compra.\n Por favor, inténtelo de nuevo.\n ${res?.message}`
      );
      return false;
    } else if (res?.message) {
      setError(res.message);
      return false;
    }
    localStorage && localStorage.setItem("tickets", JSON.stringify(res));
    console.log("Tickets created successfully", res);
    dispatch({ type: "CLEAR_CART" });
    return true;
  }

  const handlePaymentRoute = async () => {
    const valid = state.cart.every((item) =>
      item.tickets.every((ticket) => ticket.passenger?.dni !== "")
    );
    if (valid) {
      if (await handleTicketsCreation())
        router.push("cart/purchase");
    } else {
      alert(
        "Por favor, ingrese los datos de todos los pasajeros\nSerá redirigido automáticamente al formulario de pasajeros"
      );
      router.push("/book?step=2");
    }
  };

  return (
    <Box className="m-6">
      <Typography variant="h5">Carrito de compras</Typography>
      <p className="my-2">
        Total items:{" "}
        {state.cart.reduce((acc, item) => acc + item.tickets.length, 0)}
      </p>
      <Divider />
      <Box component={"ul"} className="my-6">
        {state.cart.map((item) => (
          <Box
            component={"li"}
            key={item.flight.code}
            className="flex flex-col sm:flex-row justify-between items-center border-2 rounded-lg shadow-md p-4 my-2"
          >
            <Typography className="text-center">
              {item.flight.code}
              <br />
              {item.flight.departure} <Flight className="mx-4 rotate-90" />{" "}
              {item.flight.arrival}
            </Typography>
            <Box className="flex justify-between px-6 w-11/12 sm:w-1/2">
              <Typography>
                $ {item.tickets.reduce((acc, ticket) => acc + ticket.price, 0)}
              </Typography>
              <Typography>Tiquetes: {item.tickets.length}</Typography>
            </Box>
            <Tooltip title="Borrar">
              <IconButton
                color="error"
                size="small"
                aria-label="borrar"
                onClick={() =>
                  dispatch({
                    type: "REMOVE_FROM_CART",
                    payload: item.flight.code,
                  })
                }
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>
      <Box className="mt-16 flex justify-between">
        {error && (
          <Alert severity="error" className="my-3">
            {error.split(".").map((err, i) => (
              <Typography key={i}>{err}</Typography>
            ))}
          </Alert>
        )}
        <Button
          variant="outlined"
          onClick={() => dispatch({ type: "CLEAR_CART" })}
        >
          Limpiar carrito
        </Button>
        <Button variant="contained" onClick={() => handlePaymentRoute()}>
          Proceder al pago
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
