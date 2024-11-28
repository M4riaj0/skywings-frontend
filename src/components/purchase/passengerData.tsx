import React, { useState, useEffect } from "react";
import { useCartContext } from "@/context/cart";
import { Alert, Box, Button, Typography } from "@mui/material";
import { FlightTakeoff, FlightLand } from "@mui/icons-material";  // Importar los iconos adecuados
import PassengerForm from "@/components/purchase/passengerForm";
import { IPassenger, ITicket } from "@/schemas/cartSchemas";

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
      newTickets[index] = { ...newTickets[index], passenger: data };
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
        `El pasajero ${data.dni} NO puede ser agregado dos veces en el mismo vuelo`
      );
    }
  };

  const assignPreviousPassenger = (index: number, passenger: IPassenger) => {
    handleInputChange(index, "Vuelta", passenger);
    setShouldRefreshForm(true);
  };

  const renderPassengerForm = (ticket: ITicket, index: number) => (
    <PassengerForm
      key={index}
      ticket={ticket}
      handleSubmit={(data: IPassenger) => handleInputChange(index, "Ida", data)}
      shouldRefresh={shouldRefreshForm}
    />
  );

  return (
    <section className="space-y-6">
      {passengersError && (
        <Alert severity="error" className="my-4">
          {passengersError}
        </Alert>
      )}
      <Box>
        {/* Título de Ida */}
        <Box className="flex items-center space-x-4 mt-4">
          <Typography variant="h4" className="my-3 font-bold" style={{ color: "blue" }}>
            Ida
          </Typography>
          <FlightTakeoff className="text-4xl md:text-6xl transform" style={{ color: "blue" }} />
        </Box>
        {tickets
          .filter((ticket) => ticket.type === "Ida")
          .map(renderPassengerForm)}
      </Box>
      {enableReturn && (
        <Box>
          {/* Título de Vuelta */}
          <Box className="flex items-center space-x-4 mt-4">
          <Typography variant="h4" className="my-3 font-bold" style={{ color: "blue" }}>
            Vuelta
          </Typography>
          <FlightLand className="text-4xl md:text-6xl transform" style={{ color: "blue" }} />
        </Box>
          {tickets
            .filter((ticket) => ticket.type === "Vuelta")
            .map((ticket, index) => (
              <div key={index} className="space-y-4">
                <Box className="flex items-center space-x-4">
                  <Typography variant="h6" className="text-md font-medium">
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
                          variant="outlined"
                          className="hover:bg-gray-100 transition-all"
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
