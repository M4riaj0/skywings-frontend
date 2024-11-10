import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Divider,
  Collapse,
  Box,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState, useContext } from "react";
import { CartContext } from "@/services/cart";
import FlightIcon from "@mui/icons-material/Flight";
import { FlightData } from "@/app/schemas/flightFormSchema";
import { formatDateAndTime } from "@/services/cities";

export default function FligthCard(flightInfo: FlightData) {
  // Flight details and formatting dates
  const departure1 = formatDateAndTime(
    flightInfo.origin,
    flightInfo.departureDate1
  );
  const arrival1 = formatDateAndTime(
    flightInfo.destination,
    flightInfo.arrivalDate1
  );
  const [expanded, setExpanded] = useState(false);
  
  // Cart functionality
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("CartContext is undefined");
  }
  // ! Consider to delete state
  const {state, dispatch } = cartContext;
  const [ticketBook, setTicketBook] = useState({
    ticketClass: "Económica",
    ticketQuantity: 1,
    ticketPrice: flightInfo.priceEconomyClass,
  });

  const changeTicketPrice = (quantity: number, ticketClass: string) => {
    setTicketBook({
      ticketQuantity: quantity,
      ticketClass: ticketClass,
      ticketPrice:
        ticketClass === "Económica"
          ? flightInfo.priceEconomyClass * quantity
          : flightInfo.priceFirstClass * quantity,
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAdd = () => {
    console.log(ticketBook);
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        code: flightInfo.code,
        departure: flightInfo.origin,
        arrival: flightInfo.destination,
        departureDate: flightInfo.departureDate1,
        arrivalDate: flightInfo.arrivalDate1,
        ticketClass: ticketBook.ticketClass,
        price: ticketBook.ticketPrice,
        quantity: ticketBook.ticketQuantity,
      },
    });
    // ! Consider to delete console.log
    console.log("Added to cart");
    console.log(state.cart);
  };

  return (
    <Card className="bg-slate-50 rounded-lg border border-slate-200">
      <CardActionArea
        className="text-center flex justify-between h-full"
        onClick={handleExpandClick}
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
           { ticketBook.ticketClass === 'Económica' ? flightInfo.priceEconomyClass : flightInfo.priceFirstClass} COP
          </Typography>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className="flex flex-col md:flex-row justify-between items-center">
          <Box className="flex items-center mb-4 ml-4 md:mb-0">
            <Typography variant="body1" className="text-gray-500 mr-4">
              N° de tiquetes
            </Typography>
            <input
              type="number"
              min="1"
              max="5"
              className="border border-gray-300 rounded-md h-12 w-16 text-center"
              value={ticketBook.ticketQuantity}
              onChange={(e) => {
                const value =
                  parseInt(e.target.value) > 5 ? 5 : parseInt(e.target.value);
                changeTicketPrice(value, ticketBook.ticketClass);
              }}
            />
          </Box>
          <Box className="flex items-center">
            <Typography variant="body1" className="text-gray-500 mr-4">
              Clase
            </Typography>
            <Select
              className="w-36 h-12 text-center"
              value={ticketBook.ticketClass}
              onChange={(e) => {
                changeTicketPrice(ticketBook.ticketQuantity, e.target.value);
              }}
            >
              <MenuItem value="Económica">Económica</MenuItem>
              <MenuItem value="Primera">Primera</MenuItem>
            </Select>
          </Box>
          <Button
            className="text-white px-4 py-2 mr-4 rounded-lg"
            color="primary"
            variant="contained"
            onClick={handleAdd}
          >
            Reservar
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
}
