import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FlightData } from "@/schemas/flightFormSchema";
import { formatDateAndTime } from "@/services/cities";
import ClassCard from "./classCard";

interface FlightsListProps { type: string, flights: FlightData[]; }

const FlightsList: React.FC<FlightsListProps> = ({type, flights }) => {
  return (
    <section className="my-5">
      <ul>
        {flights.map((flight) => (
          <li key={flight.code}>
            <Accordion>
              <AccordionSummary>
                <Typography variant="h5">
                  {flight.origin.split(",")[0]} -{" "}
                  {flight.destination.split(",")[0]}
                </Typography>

                {flight.type === "international" && (
                  <Typography variant="subtitle1" sx={{ marginX: 3 }}>
                    {
                      formatDateAndTime(flight.origin, flight.departureDate1)
                        .date
                    }{" "}
                    -{" "}
                    {
                      formatDateAndTime(flight.destination, flight.arrivalDate1)
                        .date
                    }
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ marginX: 3 }}>
                  {formatDateAndTime(flight.origin, flight.departureDate1).time}{" "}
                  -{" "}
                  {
                    formatDateAndTime(flight.destination, flight.arrivalDate1)
                      .time
                  }
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <ClassCard
                  flight={flight}
                  type={type}
                  classType="Tourist"
                  price={flight.priceEconomyClass}
                />
                <ClassCard
                  flight={flight}
                  type={type}
                  classType="First"
                  price={flight.priceFirstClass}
                />
              </AccordionDetails>
            </Accordion>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FlightsList;
