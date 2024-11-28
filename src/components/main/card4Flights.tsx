import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Divider,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { FlightData } from "@/schemas/flightFormSchema";
import { formatDateAndTime } from "@/services/cities";
import { useRouter } from "next/navigation";

export default function FligthCard(flightInfo: FlightData) {
  const router = useRouter();
  // Flight details and formatting dates
  const departure1 = formatDateAndTime(
    flightInfo.origin,
    flightInfo.departureDate1
  );
  const arrival1 = formatDateAndTime(
    flightInfo.destination,
    flightInfo.arrivalDate1
  );

  // Handle route click
  const handleRouteClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const userRole = localStorage.getItem("role");
    if (userRole !== "USER") {
      router.push("/");
      return;
    }

    const query = new URLSearchParams({
      departure: flightInfo.origin,
      arrival: flightInfo.destination,
      departureDate: flightInfo.departureDate1,
    }).toString();
    
    router.push(`/book?${query}`);
  };

  return (
    <Card className="bg-slate-50 rounded-lg border border-slate-200">
      <CardActionArea
        className="text-center flex justify-between h-full"
        onClick={handleRouteClick}
      >
        <CardContent className="flex flex-col items-center w-[25%] md:w-[20%]">
          <Typography variant="body2" className="text-gray-500">
            {departure1.date}
            <br />
            {departure1.time}
          </Typography>
          <Typography className="text-lg md:text-xl font-bold">
            {flightInfo.origin.split(",")[0]}
          </Typography>
        </CardContent>
        <Divider
          flexItem
          className="hidden md:block w-[15%] mb-14 mx-3 border-b-2 border-slate-500 border-dashed"
        />
        <FlightIcon className="text-3xl md:text-5xl transform rotate-90" />
        <Divider
          flexItem
          className="hidden md:block w-[15%] mb-14 mx-3 border-b-2 border-slate-500 border-dashed"
        />
        <CardContent className="flex flex-col items-center w-[25%] md:w-[20%]">
          <Typography variant="body2" className="text-gray-500">
            {arrival1.date}
            <br />
            {arrival1.time}
          </Typography>
          <Typography className="text-lg md:text-xl font-bold">
            {flightInfo.destination.split(",")[0]}
          </Typography>
        </CardContent>
        <CardContent className="flex flex-col items-center w-[30%] md:w-[20%] py-7 bg-gray-200">
          <Typography variant="body1" className="text-gray-500">
            Desde
          </Typography>
          <Typography variant="body1" className="text-center font-bold text-xl">
            $ {flightInfo.priceEconomyClass} COP
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
