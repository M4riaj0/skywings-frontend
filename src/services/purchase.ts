import { ICartItem, ITicket } from "@/app/schemas/cartSchemas";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const formatBookData = (cart: ICartItem[]) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  
  const data = {
    username: JSON.parse(atob(token.split(".")[1])).username,
    listTickets: cart.flatMap((item) => adaptTicketsData(item.tickets))
  };
  
  return data;
};

// Modify the adaptTicketsData function to handle potential errors
const adaptTicketsData = (tickets: ITicket[]) => {
  try {
    const groupedTickets = tickets.reduce((acc, ticket) => {
      const key = `${ticket.flightCode}-${ticket.class}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {} as Record<string, ITicket[]>);

    return Object.values(groupedTickets).map((group) => ({
      flightCode: group[0].flightCode,
      seatClass: group[0].class,
      passengers: group.map((ticket) => 
        ticket.passenger ? [{ 
          ...ticket.passenger, 
          birthdate: new Date(ticket.passenger.birthDate), 
          flightCode: ticket.flightCode 
        }] : []
      ).flatMap((passenger) => passenger),
    }));
  } catch (error) {
    console.error("Error adapting tickets data:", error);
    return []; // Return an empty array if there's an error
  }
};

export const createBook = async (cart: ICartItem[]) => {
  try {
    const data = formatBookData(cart);
    console.log(data);
    
    const response = await fetch(`${backend_url}/tickets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    
    console.log(response);
    return response.json();
  } catch (error) {
    console.error("Error creating book:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

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
};
