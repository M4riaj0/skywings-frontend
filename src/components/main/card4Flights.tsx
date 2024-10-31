import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Divider,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { FlightData } from "@/app/schemas/flightFormSchema";

const cityTimeZoneMap: { [key: string]: string } = {
  "Madrid, España": "Europe/Madrid",
  "Londres, Reino Unido": "Europe/London",
  "New York, Estados Unidos": "America/New_York",
  "Buenos Aires, Argentina": "America/Argentina/Buenos_Aires",
  "Miami, Estados Unidos": "America/New_York",
  "Bogotá, Colombia": "America/Bogota", // Asumiendo Bogotá para vuelos nacionales en Colombia
};
const formatDateAndTime = (city: string, dateTime: string) => {
  const modifiedCity = city.includes("Colombia") ? `Bogotá, Colombia` : city;
  const timeZone = cityTimeZoneMap[modifiedCity];
  const [date, time] = dateTime.split("T");
  const formattedTime = time
      ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
            timeZone: timeZone,
        })
      : "";
  return { date, time: formattedTime };
};

export default function FligthCard(flightInfo: FlightData) {
  const departure1 = formatDateAndTime(flightInfo.origin, flightInfo.departureDate1);
  const arrival1 = formatDateAndTime(flightInfo.destination, flightInfo.arrivalDate1);
  return (
    <Card className="bg-slate-50 rounded-lg border border-slate-200">
      <CardActionArea className="text-center flex justify-between h-full">
        <CardContent className="flex flex-col items-center w-[20%]">
          <Typography variant="body2" className="text-gray-500">
            {departure1.date}
            <br />
            {departure1.time}
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
            {arrival1.date}
            <br />
            {arrival1.time}
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
