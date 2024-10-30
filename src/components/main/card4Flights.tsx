import { Card, CardContent, CardActionArea, Typography } from "@mui/material";
import { FlightData } from "@/app/schemas/flightFormSchema";

export default function FligthCard(flightInfo: FlightData) {
  return (
    <Card className="bg-slate-100 w-4/5">
      <CardActionArea className="text-center flex flex-col h-full">
        <Typography gutterBottom variant="h6" component="div"className="font-bold">
          Vuelo {flightInfo.destination.split(",")[0]} a{" "}
          {flightInfo.destination.split(",")[0]}
        </Typography>
        <CardContent className="flex items-center space-x-10 pb-0">
          <Typography variant="body2" className="text-gray-500">
            {flightInfo.departureDate1.split("T")[0]}
            <br />
            {flightInfo.departureDate1
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")}
          </Typography>
          <Typography variant="body1" className="text-center font-bold text-xl">
            Desde {flightInfo.priceEconomyClass} COP
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
