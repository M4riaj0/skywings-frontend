import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FlightData } from "@/app/schemas/flightFormSchema";
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
              <AccordionDetails className="grid grid-cols-2 gap-10">
                <ClassCard
                  flight={flight}
                  type={type}
                  classType="Ecónomica"
                  price={flight.priceEconomyClass}
                />
                <ClassCard
                  flight={flight}
                  type={type}
                  classType="Primera"
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
