import { useCartContext } from "@/context/cart";
import { ICartItem } from "@/schemas/cartSchemas";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

const PurchaseSummary = () => {
  const { state } = useCartContext();
  const items = state.cart as ICartItem[];

  return (
    <Box className="purchase-summary p-2 sm:p-4 mx-auto max-w-4xl">
      {items.length === 0 ? (
        <Typography variant="h6" className="text-center mt-4">
          No hay tiquetes en el carrito.
        </Typography>
      ) : (
        items.map((item) => (
          <Card
            key={item.flight.code}
            className="border rounded-lg shadow-md relative overflow-hidden mb-4"
          >
            <CardContent className="p-3">
              <Box className="flex flex-col sm:flex-row items-center justify-between">
                <Box className="flex items-center mb-4 sm:mb-0">
                  <AirplaneTicketIcon className="text-blue-500" fontSize="large" />
                  <Typography
                    variant="h6"
                    className="ml-2 font-bold text-lg sm:text-xl"
                  >
                    Vuelo {item.flight.code}
                  </Typography>
                </Box>

                <Box
                  className="bg-gray-200 p-2 sm:p-4 rounded-lg text-center"
                >
                  <Typography
                    variant="body2"
                    className="text-gray-500 text-sm sm:text-base"
                  >
                    Precio Total
                  </Typography>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 text-lg sm:text-xl"
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
                className="mt-2 text-sm sm:text-base"
              >
                {item.flight.departure} → {item.flight.arrival}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1 text-sm sm:text-base"
              >
                Total de tiquetes: {item.tickets.length}
              </Typography>

              <Divider className="my-2" />

              <Typography
                variant="body2"
                className="font-bold mb-1 text-sm sm:text-base"
              >
                Detalles de pasajeros:
              </Typography>

              <Box component="ul" className="list-none p-0">
                {item.tickets.map((ticket, index) => (
                  <Box
                    component="li"
                    key={index}
                    className="bg-gray-100 rounded-lg p-2 mb-1"
                  >
                    <Typography
                      variant="body2"
                      className="text-sm sm:text-base font-medium"
                    >
                      Pasajero: {ticket.passenger?.name1}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-sm sm:text-base text-gray-500"
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
