import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Divider,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { FlightData } from "@/app/schemas/flightFormSchema";

export default function FligthCard(flightInfo: FlightData) {
  return (
    <Card className="bg-slate-50 rounded-lg border border-slate-200">
      <CardActionArea className="text-center flex justify-between h-full">
        <CardContent className="flex flex-col items-center w-[20%]">
          <Typography variant="body2" className="text-gray-500">
            {flightInfo.departureDate1.split("T")[0]}
            <br />
            {flightInfo.departureDate1
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")}
          </Typography>
          <Typography variant="h6" component="div" className="font-bold">
            {flightInfo.origin.split(",")[0]}
          </Typography>
        </CardContent>
        <Divider
          flexItem
          className="hidden md:block w-[15%] mb-14 mx-3 border-b-2 border-slate-500 border-dashed"
        />
        <FlightIcon className="text-5xl transform rotate-90" />
        <Divider
          flexItem
          className="hidden md:block w-[15%] mb-14 mx-3 border-b-2 border-slate-500 border-dashed"
        />
        <CardContent className="flex flex-col items-center w-[20%]">
          <Typography variant="body2" className="text-gray-500">
            {flightInfo.arrivalDate1.split("T")[0]}
            <br />
            {flightInfo.arrivalDate1
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")}
          </Typography>
          <Typography variant="h6" component="div" className="font-bold">
            {flightInfo.destination.split(",")[0]}
          </Typography>
        </CardContent>
        <CardContent className="flex flex-col items-center w-[20%] py-7 bg-gray-200">
          <Typography variant="body1" className="text-gray-500">
            Desde
          </Typography>
          <Typography variant="body1" className="text-center font-bold text-xl">
            {flightInfo.priceEconomyClass} COP
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
