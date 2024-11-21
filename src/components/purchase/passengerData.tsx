import React, { useState, useEffect } from "react";
import { useCartContext } from "@/context/cart";
import { Alert, Box, Button, Typography } from "@mui/material";
import PassengerForm from "@/components/purchase/passengerForm";
import { IPassenger, ITicket } from "@/app/schemas/cartSchemas";

interface PassengerDataProps {
  enableReturn: boolean;
}

const PassengerData: React.FC<PassengerDataProps> = ({ enableReturn }) => {
  const { state, dispatch } = useCartContext();

  const passengers = state.cart
    .map((item) => item.tickets)
    .flat()
    .filter((ticket) => ticket.type === "Ida")
    .map((ticket) => ticket.passenger);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [passengersError, setPassengersError] = useState("");
  const [passengersAdded, setPassengersAdded] = useState<string[][]>([[], []]);
  const [shouldRefreshForm, setShouldRefreshForm] = useState(false);

  useEffect(() => {
    setTickets(state.cart.map((item) => item.tickets).flat());
  }, [state.cart]);

  const validatePassenger = (type: string, data: IPassenger): boolean =>
    passengersAdded.length > 0 &&
    passengersAdded[type === "Ida" ? 0 : 1].includes(data.dni);

  const handleInputChange = (index: number, type: string, data: IPassenger) => {
    if (!validatePassenger(type, data)) {
      const newTickets = [...tickets].filter((ticket) => ticket.type === type);
      console.log(newTickets);
      newTickets[index] = { ...newTickets[index], passenger: data };
      console.log(newTickets);
      dispatch({
        type: "ADD_PASSENGERS",
        payload: {
          flightCode: newTickets[index].flightCode,
          tickets: newTickets,
        },
      });
      setTickets(newTickets);
      setPassengersError("");
      setPassengersAdded((prev) => prev.map((arr) => [...arr]));
      setPassengersAdded((prev) => {
        const newPassengersAdded = [...prev];
        newPassengersAdded[type === "Ida" ? 0 : 1] = [
          ...newPassengersAdded[type === "Ida" ? 0 : 1],
          data.dni,
        ];
        return newPassengersAdded;
      });
    } else {
      setPassengersError(
        "El pasajero NO puede ser agregado dos veces en el mismo vuelo"
      );
    }
  };

  const assignPreviousPassenger = (index: number, passenger: IPassenger) => {
    handleInputChange(index, "Vuelta", passenger);
    setShouldRefreshForm(true);
  }

  const renderPassengerForm = (ticket: ITicket, index: number) => (
    <PassengerForm
      key={index}
      ticket={ticket}
      handleSubmit={(data: IPassenger) => handleInputChange(index, "Ida", data)}
      shouldRefresh={shouldRefreshForm}
    />
  );

  return (
    <section>
      {passengersError && (
        <Alert severity="error" className="my-3">
          {passengersError}
        </Alert>
      )}
      <Box>
        <Typography variant="h5" className="my-3">
          Ida
        </Typography>
        {tickets
          .filter((ticket) => ticket.type === "Ida")
          .map(renderPassengerForm)}
      </Box>
      {enableReturn && (
        <Box>
          <Typography variant="h5" className="my-3">
            Vuelta
          </Typography>
          {tickets
            .filter((ticket) => ticket.type === "Vuelta")
            .map((ticket, index) => (
              <div key={index}>
                <Box className="flex space-x-4">
                  <Typography variant="h6">
                    Seleccionar pasajero anterior
                  </Typography>
                  {passengers.map(
                    (passenger, passengerIndex) =>
                      passenger && (
                        <Button
                          key={passengerIndex}
                          onClick={() => {
                            assignPreviousPassenger(index, passenger);
                          }}
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
      )}
    </section>
  );
};

export default PassengerData;
