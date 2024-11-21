import { useContext } from "react";
import { CartContext } from "@/context/cart";
import { ICartItem } from "@/app/schemas/cartSchemas";
import { Box, Typography } from "@mui/material";

const PurchaseSummary = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartContext must be used within a CartProvider");
  const { state } = cartContext;
  const items = state.cart as ICartItem[];

  return (
    <Box className="purchase-summary" sx={{ padding: 2 }}>
      <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <Box component="li" key={item.flight.code} sx={{ marginBottom: 2 }}>
            <Typography variant="body1">Vuelo {item.flight.code}</Typography>
            <Typography variant="body2">
              {item.flight.departure} - {item.flight.arrival}
            </Typography>
            <Typography variant="body2">
              Tiquetes en carrito: {item.tickets.length}
            </Typography>
            <Typography variant="body2">
              Total:{" "}
              {item.tickets.reduce((total, ticket) => total + ticket.price, 0)}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
              {item.tickets.map((ticket, index) => (
                <Box component="li" key={index} sx={{ marginBottom: 1 }}>
                  <Typography variant="body2">Pasajero: {ticket.passenger?.name1}</Typography>
                  <Typography variant="body2">Edad: {ticket.passenger?.email}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PurchaseSummary;
