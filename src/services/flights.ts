import { FlightForm, FlightFormToSend, FlightFormUpdate } from "@/schemas/flightFormSchema";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAvaliableFlights = async () => {
  try {
    const response = await fetch(`${backend_url}/flights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getRealizedFlights = async () => {
  try {
    const response = await fetch(`${backend_url}/flights/realized`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getFlightsRoute = async (origin: string, destination: string) => {
  try {
    const response = await fetch(`${backend_url}/flights/route?origin=${origin}&destination=${destination}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getAllFligthNews = async () => {
  try {
    const response = await fetch(`${backend_url}/flights/news`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getFlightSeats = async (flightCode: string) => {
  try {
    const response = await fetch(`${backend_url}/flights/seats/${flightCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const createFlight = async (flightData: FlightForm) => {
  const token = localStorage.getItem("token");
  let username;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
  }
  try {
    const dataToSend: FlightFormToSend = {
      ...flightData,
      creator: username,
      departureDate1: new Date(`${flightData.departure.date}T${flightData.departure.time}Z`),
      lastUpdateDate: new Date(),
    };
    console.log(dataToSend);

    const response = await fetch(`${backend_url}/flights/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(dataToSend),
    });

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const updateFlight = async (flightData: FlightFormUpdate) => {
  const token = localStorage.getItem("token");
  let username;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
  }
  try {
    const response = await fetch(`${backend_url}/flights/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ updater: username, ...flightData}),
    });

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const deleteFlight = async (code: string) => {
  try {
    const response = await fetch(`${backend_url}/flights/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ flightCode: code }),
    });

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}