"use client";

import {
  Box,
  Button,
  Divider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAvaliableFlights } from "@/services/flights";
import { FlightData } from "../schemas/flightFormSchema";
import FlightsList from "@/components/purchase/flightsList";
import PassengerData from "@/components/purchase/passengerData";

const filterFlights = (
  flights: FlightData[],
  searchParams: URLSearchParams
): FlightData[] => {
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  return flights.filter((flight) => {
    return (
      (!origin || flight.origin === origin) &&
      (!destination || flight.destination === destination) &&
      (!date || flight.departureDate1.split("T")[0] === date)
    );
  });
};

const BookPage = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const searchParams = useSearchParams();
  const [returnOptions, setReturnOptions] = useState<FlightData[]>([]);
  const [enableReturn, setEnableReturn] = useState(false);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const loadFlights = async () => {
      const allFlights = await getAvaliableFlights();
      const filteredFlights = filterFlights(allFlights, searchParams);
      setFlights(filteredFlights);
    };

    loadFlights();
  }, [searchParams]);

  const handleReturn = async () => {
    const allFlights = await getAvaliableFlights();
    const invertedSearchParams = new URLSearchParams(searchParams.toString());
    invertedSearchParams.set("origin", searchParams.get("destination") || "");
    invertedSearchParams.set("destination", searchParams.get("origin") || "");
    invertedSearchParams.set("date", returnDate || "");
    const filteredReturnFlights = filterFlights(
      allFlights,
      invertedSearchParams
    );
    setReturnOptions(filteredReturnFlights);
  };

  return (
    <>
      {step === 1 && (
        <>
          <section>
            <Typography variant="h3" className="my-3">
              Vuelos disponibles
            </Typography>
            <Divider />
            <Box className="my-4 flex justify-evenly items-center">
              <TextField
                label="Origen"
                variant="outlined"
                value={searchParams.get("departure")}
                disabled
                className="mx-3"
              />
              <TextField
                label="Destino"
                variant="outlined"
                value={searchParams.get("arrival")}
                disabled
                className="mx-3"
              />
              <TextField
                label="Fecha"
                variant="outlined"
                value={searchParams.get("departureDate")?.split("T")[0]}
                disabled
                className="mx-3"
              />
              <TextField
                label="Fecha de regreso"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={returnDate?.split("T")[0] || ""}
                disabled={!enableReturn}
                className="mx-3 w-[20%]"
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  handleReturn();
                }}
              />
              <Box className="flex flex-col items-center mx-3">
                <Typography>Vuelta</Typography>
                <Switch
                  checked={enableReturn}
                  onChange={(e) => setEnableReturn(e.target.checked)}
                  color="primary"
                />
              </Box>
            </Box>
          </section>
          <FlightsList type="Ida" flights={flights} />
          {enableReturn && (
            <>
              <Typography variant="h4" className="my-3">
                Vuelos de regreso
              </Typography>
              <Divider className="mb-5" />
              <FlightsList type="Vuelta" flights={returnOptions} />
            </>
          )}
        </>
      )}
      {step === 2 && (
        <section>
          <Typography variant="h3" className="my-3">
            Datos de pasajeros
          </Typography>
          <Divider />
          <PassengerData />
        </section>
      )}
      {step === 3 && (
        <section>
          <Typography variant="h3" className="my-3">
            Resumen de compra
          </Typography>
          <Divider />
        </section>
      )}
      <Box className="flex justify-between">
        <Button variant="contained" color="secondary"
          onClick={() =>
            step === 1 ? router.push("/") : setStep(step - 1)
          }
          >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            step === 3 ? router.push("/cart") : setStep(step + 1)
          }
        >
          {step === 3 ? "Ir al carrito" : "Continuar"}
        </Button>
      </Box>
    </>
  );
};

export default BookPage;
