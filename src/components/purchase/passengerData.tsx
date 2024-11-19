import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "@/context/cart";
import { Box, Typography } from "@mui/material";
import PassengerForm from "@/components/purchase/passengerForm";
import { IPassenger, ITicket } from "@/app/schemas/cartSchemas";

const PassengerData: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  const { state } = cartContext;
  const [passengers, setPassengers] = useState<IPassenger[]>([]);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    // Update the passenger count and tickets based on the cart context
    const count = state.cart.reduce(
      (total, item) => total + item.tickets.length,
      0
    );
    setPassengers(
      Array(count).fill({
        dni: "",
        name1: "",
        name2: "",
        surname1: "",
        surname2: "",
        birthDate: new Date(),
        gender: "",
        phone: "",
        email: "",
        contactName: "",
        contactPhone: "",
      })
    );
    setTickets(state.cart.map((item) => item.tickets).flat());
  }, [state.cart]);

  const handleInputChange = (index: number, data: IPassenger) => {
    const newPassengers = [...passengers];
    newPassengers[index] = data;
    setPassengers(newPassengers);
    console.log(passengers);
  };

  const assignPreviousPassenger = (index: number, passenger: IPassenger) => {
    handleInputChange(index, passenger);
  };

  const renderPassengerForm = (ticket: ITicket, index: number) => (
    <PassengerForm
      key={index}
      ticket={ticket}
      handleSubmit={(data: IPassenger) => handleInputChange(index, data)}
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
              {renderPassengerForm(ticket, index)}
              <Typography variant="h6" className="my-3">
                Select Previous Passenger
              </Typography>
              {passengers.map((passenger, passengerIndex) => (
                <Box
                  key={passengerIndex}
                  onClick={() => assignPreviousPassenger(index, passenger)}
                >
                  <Typography>
                    {passenger.name1} {passenger.surname1}
                  </Typography>
                </Box>
              ))}
            </div>
          ))}
      </Box>
    </section>
  );
};

export default PassengerData;
