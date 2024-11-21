"use client";

import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/cart";
import { createBook } from "@/services/purchase";

interface BookTicket {
  flightCode: string;
  passengerDni: string;
  username: string;
  purchaseId: number;
  seatNumber: number;
  price: number;
  creationDate: Date;
  checkIn?: Date;
  numSuitcase: number;
}

function ConfirmPage() {
  const [bookTickets, setBookTickets] = useState<BookTicket[]>([]);
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("Cart context is not set");
  }

  useEffect(() => {
    async function fetchData() {
      if (cart) {
        const res = await createBook(cart.state.cart);
        console.log(res);
        setBookTickets(res);
      }
    }

    fetchData();
  }, [cart]);

  return (
    <div>
      <h1>Confirm Booking</h1>
      <ul>
        {bookTickets.map((ticket) => (
          <li key={ticket.flightCode}>
            {ticket.passengerDni} - {ticket.price} - {ticket.flightCode}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConfirmPage;
