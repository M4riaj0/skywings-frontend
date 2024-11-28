import { useCartContext } from "@/context/cart";
import { ICartItem } from "@/schemas/cartSchemas";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

const PurchaseSummary = () => {
  const { state } = useCartContext();
  const items = state.cart as ICartItem[];

  return (
    <Box className="purchase-summary" sx={{ padding: 2 }}>
      {items.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
          No hay tiquetes en el carrito.
        </Typography>
      ) : (
        items.map((item) => (
          <Card
            key={item.flight.code}
            className="border rounded-lg shadow-md my-4"
            sx={{ position: "relative", overflow: "hidden" }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <AirplaneTicketIcon className="text-blue-500" fontSize="large" />
                  <Typography
                    variant="h6"
                    sx={{ marginLeft: 2, fontWeight: "bold", fontSize: "1.5rem" }}
                  >
                    Vuelo {item.flight.code}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "#e0e0e0",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    className="text-gray-500"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Precio Total
                  </Typography>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800"
                    sx={{ fontSize: "1.4rem" }}
                  >
                    {item.tickets
                      .reduce((total, ticket) => total + ticket.price, 0)
                      .toLocaleString()}{" "}
                    COP
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 2, fontSize: "1rem" }}
              >
                {item.flight.departure} → {item.flight.arrival}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 1, fontSize: "1rem" }}
              >
                Total de tiquetes: {item.tickets.length}
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", marginBottom: 1, fontSize: "1rem" }}
              >
                Detalles de pasajeros:
              </Typography>

              <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
                {item.tickets.map((ticket, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      padding: 2,
                      marginBottom: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.9rem", fontWeight: "medium" }}
                    >
                      Pasajero: {ticket.passenger?.name1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.9rem", color: "gray" }}
                    >
                      Correo: {ticket.passenger?.email}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default PurchaseSummary;
