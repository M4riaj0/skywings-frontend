"use client";

import {
  Alert,
  Box,
  Button,
  Divider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getAvaliableFlights } from "@/services/flights";
import { FlightData } from "../../schemas/flightFormSchema";
import FlightsList from "@/components/purchase/flightsList";
import PassengerData from "@/components/purchase/passengerData";
import PurchaseSummary from "@/components/purchase/summary";
import { useCartContext } from "@/context/cart";

const filterFlights = (
  flights: FlightData[],
  searchParams: URLSearchParams
): FlightData[] => {
  const origin = searchParams.get("departure");
  const destination = searchParams.get("arrival");
  const date = searchParams.get("departureDate")?.split("T")[0];

  return flights.filter((flight) => {
    return (
      flight.origin === origin &&
      flight.destination === destination &&
      (!date || flight.departureDate1.split("T")[0] === date)
    );
  });
};

export default function BookPage() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [returnOptions, setReturnOptions] = useState<FlightData[]>([]);
  const [enableReturn, setEnableReturn] = useState(false);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  const { state } = useCartContext();

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    const loadFlights = async () => {
      if (!searchParams) return;
      
      if (searchParams.get("step") === "2") {
        setStep(2);
        return;
      }
      const allFlights = await getAvaliableFlights();
      const filteredFlights = filterFlights(allFlights, searchParams);
      setFlights(filteredFlights);
    };

    loadFlights();
  }, [searchParams]);

  const validateStep = (step: number) => {
    if (step === 1) {
      const valid = state.cart[0] != null;
      if (!valid) setStepError("Debe seleccionar al menos un vuelo");
      else setStepError("");
      return valid;
    } else if (step === 2) {
      const valid = state.cart.every((item) =>
        item.tickets.every((ticket) => ticket.passenger?.dni !== "")
      );
      console.log(state.cart[0].tickets[0].passenger);
      console.log(valid);
      if (!valid)
        setStepError("Debe ingresar los datos de todos los pasajeros");
      else setStepError("");
      return valid;
    } else {
      return true;
    }
  };

  const handleReturn = async () => {
    const allFlights = await getAvaliableFlights();
    if (!searchParams) return;
    const invertedSearchParams = new URLSearchParams(searchParams.toString());
    invertedSearchParams.set("departure", searchParams.get("arrival") || "");
    invertedSearchParams.set("arrival", searchParams.get("departure") || "");
    invertedSearchParams.set("departureDate", returnDate || "");
    const filteredReturnFlights = filterFlights(
      allFlights,
      invertedSearchParams
    );
    setReturnOptions(filteredReturnFlights);
  };

  return (
    <>
      {stepError && (
        <Alert severity="error" className="my-3">
          {stepError}
        </Alert>
      )}
      {step === 1 && (
        <>
        <Suspense fallback={<div>Cargando...</div>}>
          <section>
            <Typography variant="h3" className="my-3">
              Vuelos disponibles
            </Typography>
            <Divider />
            <Box className="my-4 flex justify-evenly items-center">
              <TextField
                label="Origen"
                variant="outlined"
                value={searchParams?.get("departure")}
                disabled
                className="mx-3"
              />
              <TextField
                label="Destino"
                variant="outlined"
                value={searchParams?.get("arrival")}
                disabled
                className="mx-3"
              />
              <TextField
                label="Fecha"
                variant="outlined"
                value={searchParams?.get("departureDate")?.split("T")[0]}
                disabled
                className="mx-3"
              />
              <TextField
                label="Fecha de regreso"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  htmlInput: {
                    min: new Date().toISOString().split("T")[0],
                    max: new Date(
                      new Date().setDate(new Date().getDate() + 365)
                    )
                      .toISOString()
                      .split("T")[0],
                  },
                }}
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
          </Suspense>
        </>
      )}
      {step === 2 && (
        <section>
          <Typography variant="h3" className="my-3">
            Datos de pasajeros
          </Typography>
          <Divider />
          <PassengerData enableReturn={enableReturn} />
        </section>
      )}
      {step === 3 && (
        <section>
          <Typography variant="h3" className="my-3">
            Resumen de compra
          </Typography>
          <Divider />
          <PurchaseSummary />
        </section>
      )}
      <Box className="flex justify-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => (step === 1 ? router.push("/") : setStep(step - 1))}
        >
          Volver
        </Button>
        {step === 3 && (
          <Button
            variant="contained"
            onClick={() => router.push("/book/confirm")}
          >
            Reservar
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() =>
            step === 3
              ? router.push("/cart")
              : validateStep(step) && setStep(step + 1)
          }
        >
          {step === 3 ? "Ir al carrito" : "Continuar"}
        </Button>
      </Box>
    </>
  );
}
