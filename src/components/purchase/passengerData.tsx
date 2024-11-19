import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "@/context/cart";
import { Box, Button, Typography } from "@mui/material";
import PassengerForm from "@/components/purchase/passengerForm";
import { IPassenger, ITicket } from "@/app/schemas/cartSchemas";

const PassengerData: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  const { dispatch, state } = cartContext;
  const passengers = state.cart
    .map((item) => item.tickets)
    .flat()
    .filter((ticket) => ticket.type === "Ida")
    .map((ticket) => ticket.passenger);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    // Update the passenger count and tickets based on the cart context
    setTickets(state.cart.map((item) => item.tickets).flat());
  }, [state.cart]);

  const handleInputChange = (index: number, type: string, data: IPassenger) => {
    const newTickets = tickets.filter((ticket) => ticket.type === type);
    newTickets[index] = { ...newTickets[index], passenger: data };
    dispatch({
      type: "ADD_PASSENGERS",
      payload: {
        flightCode: newTickets[index].flightCode,
        tickets: [newTickets[index]],
      },
    });
    setTickets(newTickets);
  };

  const assignPreviousPassenger = (index: number, passenger: IPassenger) => {
    console.log("assigning previous passenger", passenger, index);
    handleInputChange(index, "Vuelta", passenger);
  };

  const renderPassengerForm = (ticket: ITicket, index: number) => (
    <PassengerForm
      key={index}
      ticket={ticket}
      handleSubmit={(data: IPassenger) => handleInputChange(index, "Ida", data)}
    />
  );

  return (
    <section>
      <Box>
        <Typography variant="h5" className="my-3">
          Ida
        </Typography>
        {tickets
          .filter((ticket) => ticket.type === "Ida")
          .map((ticket, index) => renderPassengerForm(ticket, index))}
      </Box>
      <Box>
        <Typography variant="h5" className="my-3">
          Vuelta
        </Typography>
        {tickets
          .filter((ticket) => ticket.type === "Vuelta")
          .map((ticket, index) => (
            <div key={index}>
              <Box className='flex space-x-4'>
                <Typography variant="h6">
                  Seleccionar pasajero anterior
                </Typography>
                {passengers.map(
                  (passenger, passengerIndex) =>
                    passenger && (
                      <Button
                        key={passengerIndex}
                        onClick={() =>
                          assignPreviousPassenger(index, passenger)
                        }
                      >
                        {passenger.name1} {passenger.surname1}
                      </Button>
                    )
                )}
              </Box>
              {renderPassengerForm(ticket, index)}
            </div>
          ))}
      </Box>
    </section>
  );
};

export default PassengerData;
