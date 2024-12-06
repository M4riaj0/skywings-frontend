"use client";

import { useCartContext } from "@/context/cart";
import {
  Box,
  Button,
  Divider,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Flight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBook } from "@/services/purchase";
import NoItemsAvailable from "@/components/noItems";

const CartPage = () => {
  const { state, dispatch } = useCartContext();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleTicketsCreation() {
    const res: { statusCode?: number; message?: string } = await createBook(state.cart);
    console.log("res handleTicket::", res);
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
      if (await handleTicketsCreation()) router.push("cart/purchase");
    } else {
      alert(
        "Por favor, ingrese los datos de todos los pasajeros\nSerá redirigido automáticamente al formulario de pasajeros"
      );
      router.push("/book?step=2");
    }
  };

  return (
    <Box className="m-6">
      <Typography variant="h4" className="font-bold mb-1">Carrito de compras</Typography>
      <Box className="my-4">
        {state.cart.length === 0 ? (
          <NoItemsAvailable message="Tu carrito está vacío." />
        ) : (
          <>
            <p>Cantidad de tiquetes: {state.cart.reduce((acc, item) => acc + item.tickets.length, 0)}</p>
            <Divider className="my-2" />
            {state.cart.map((item) => (
              <Card
                key={item.flight.code}
                className="my-4 border rounded-2xl shadow-md p-4"
              >
                <CardContent className="flex justify-between items-center">
                  <Box className="flex-1">
                    <Typography variant="h6">{item.flight.code}</Typography>
                    <Typography variant="body2">
                      {item.flight.departure} <Flight className="mx-2 rotate-90" /> {item.flight.arrival}
                    </Typography>
                  </Box>
                    <Box className="flex flex-col items-end mr-4 p-2 rounded">
                    <Typography variant="h6" className="font-bold">
                      {item.tickets.reduce((acc, ticket) => acc + ticket.price, 0)} COP
                    </Typography>
                    <Typography variant="body2">Tiquetes: {item.tickets.length}</Typography>
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
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>
      <Box className="mt-4 flex justify-between items-center">
        {error && (
          <Typography color="error" className="my-3">
            {error.split("\n").map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </Typography>
        )}
        {state.cart.length > 0 && (
          <>
            <Button
              variant="outlined"
              onClick={() => dispatch({ type: "CLEAR_CART" })}
            >
              Limpiar carrito
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePaymentRoute()}
              disabled={state.cart.length === 0}
            >
              Proceder al pago
            </Button>
          </>
        )}
      </Box>

    </Box>
  );
};

export default CartPage;
