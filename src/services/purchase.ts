import { ICartItem } from "@/app/schemas/cartSchemas";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

// TODO: export interface for data to create a book


function convertToServerFormat(cartItem: ICartItem) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const username = JSON.parse(atob(token.split(".")[1])).username;
  return {
    username: username,
    listTickets: cartItem.tickets.map(ticket => ({
      flightCode: ticket.flightCode,
      seatClass: ticket.class,
      passengers: ticket.passenger ? [{
        dni: ticket.passenger.dni.toString(),
        flightCode: ticket.flightCode,
        name1: ticket.passenger.name1,
        surname1: ticket.passenger.surname1,
        birthdate: new Date(ticket.passenger.birthDate).toISOString(),
        gender: ticket.passenger.gender,
        phone: ticket.passenger.phone,
        email: ticket.passenger.email,
        contactName: ticket.passenger.contactName,
        contactPhone: ticket.passenger.contactPhone,
        erased: false
      }] : []
    }))
  };
}

const formatBookData = (cart: ICartItem[]) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const data = cart.map(convertToServerFormat);
  return data;
}

export const createBook = async (cart: ICartItem[]) => {
  const data =  formatBookData(cart);
  console.log(data);
  try {
    const response = await fetch(`${backend_url}/tickets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const purchaseService = async (cart: ICartItem) => {
  try {
    const response = await fetch(`${backend_url}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cart),
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}
