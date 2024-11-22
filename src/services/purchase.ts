import { buyTickets, ICartItem, ITicket } from "@/app/schemas/cartSchemas";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

// TODO: export interface for data to create a book

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


export const purchaseCreate = async (item: buyTickets) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return { success: false, message: "No token found" };
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.username;
  const requestData = {
    username: username,
    cardNumber: item.cardNumber,
    cvv: item.cvv,
    tickets: [
      {
        flightCode: item.flightCode,
        passengerDni: item.passengerDni,
      },
    ]
  }
  try {
    const response = await fetch(`${backend_url}/purchase/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Compra realizada:", responseData);
      return responseData;
    } else {
      console.error("Error en la respuesta:", response.status, response.statusText);
      return { success: false, message: "Error al realizar la compra" };
    }
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
};

function setSnackBarMessage(arg0: string) {
  throw new Error("Function not implemented.");
}

function setSnackBarSeverity(arg0: string) {
  throw new Error("Function not implemented.");
}

