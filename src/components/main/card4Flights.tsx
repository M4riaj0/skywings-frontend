import {
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { FlightData } from "@/app/schemas/flightFormSchema";

export default function FligthCard(flightInfo: FlightData) {
  const theme = useTheme();
  return (
    <Card className="bg-slate-100">
      <CardActionArea className="text-center py-2 flex flex-col">
        <Typography gutterBottom variant="h6" component="div" className="font-bold">
          Vuelo a {flightInfo.destination.split(",")[0]}
        </Typography>
        <Image
          src="/images/logo.png"
          alt="Flight"
          className="mx-auto"
          width={120}
          height={120}
        />
        <CardContent className="text-left" sx={{ paddingBottom: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Código {flightInfo.code}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Origen {flightInfo.origin}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Destino {flightInfo.destination}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Salida: {flightInfo.departureDate1.split("T")[0]}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text" }}
            className="mt-2 text-center font-bold"
          >
            Desde {flightInfo.priceEconomyClass} COP
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          className="w-full font-bold "
          style={{ backgroundColor: theme.palette.secondary.light, transition: "background-color 0.2s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.secondary.main;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.secondary.light;
          }}
        >
          Añadir al carrito
        </Button>
      </CardActions>
    </Card>
  );
}
