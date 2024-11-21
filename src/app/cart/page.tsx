"use client";

import { useCartContext } from "@/context/cart";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { Delete, Flight } from "@mui/icons-material";

const CartPage = () => {
  const { state, dispatch } = useCartContext();
  return (
    <Box className="m-6">
      <Typography variant="h5">Carrito de compras</Typography>
      <p className="my-2">
        Total items:{" "}
        {state.cart.reduce((acc, item) => acc + item.tickets.length, 0)}
      </p>
      <Divider />
      <Box component={"ul"} className="my-4">
        {state.cart.map((item) => (
          <Box
            component={"li"}
            key={item.flight.code}
            className="flex flex-col sm:flex-row justify-between items-center border rounded-lg shadow-md p-4 my-2"
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
    </Box>
  );
};

export default CartPage;
