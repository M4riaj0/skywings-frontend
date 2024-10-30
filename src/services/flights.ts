import { FlightForm, FlightFormToSend, FlightFormUpdate } from "@/app/schemas/flightFormSchema";

const international = {
  colombia: [
    { city: "Pereira, Colombia", code: "PER" },
    { city: "Bogotá, Colombia", code: "BOG" },
    { city: "Medellín, Colombia", code: "MED" },
    { city: "Cali, Colombia", code: "CAL" },
    { city: "Cartagena, Colombia", code: "CAR" },
  ],
  international: [
    { city: "Madrid, España", code: "MAD" },
    { city: "Londres, Reino Unido", code: "LON" },
    { city: "New York, Estados Unidos", code: "NYC" },
    { city: "Buenos Aires, Argentina", code: "BUE" },
    { city: "Miami, Estados Unidos", code: "MIA" },
  ],
};

const national = {
  capitals: [
    { city: "Bogotá, Colombia", code: "BOG" },
    { city: "Medellín, Colombia", code: "MED" },
    { city: "Cali, Colombia", code: "CAL" },
    { city: "Barranquilla, Colombia", code: "BAR" },
    { city: "Cartagena, Colombia", code: "CAR" },
    { city: "Cúcuta, Colombia", code: "CUC" },
    { city: "Bucaramanga, Colombia", code: "BUC" },
    { city: "Pereira, Colombia", code: "PER" },
    { city: "Manizales, Colombia", code: "MAN" },
    { city: "Ibagué, Colombia", code: "IBA" },
    { city: "Neiva, Colombia", code: "NEI" },
    { city: "Armenia, Colombia", code: "ARM" },
    { city: "Tunja, Colombia", code: "TUN" },
    { city: "Villavicencio, Colombia", code: "VIL" },
    { city: "Popayán, Colombia", code: "POP" },
    { city: "Pasto, Colombia", code: "PAS" },
    { city: "Santa Marta, Colombia", code: "STA" },
    { city: "Sincelejo, Colombia", code: "SIN" },
    { city: "Montería, Colombia", code: "MON" },
    { city: "Valledupar, Colombia", code: "VAL" },
    { city: "Riohacha, Colombia", code: "RIO" },
    { city: "Florencia, Colombia", code: "FLO" },
    { city: "San Andrés, Colombia", code: "SAD" },
    { city: "Leticia, Colombia", code: "LET" },
    { city: "Mocoa, Colombia", code: "MOC" },
    { city: "Mitú, Colombia", code: "MIT" },
    { city: "Puerto Carreño, Colombia", code: "PCA" },
    { city: "Quibdó, Colombia", code: "QUI" },
    { city: "Inírida, Colombia", code: "INI" },
    { city: "Yopal, Colombia", code: "YOP" },
    { city: "Arauca, Colombia", code: "ARA" },
  ],
};

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getLocations = async (type: string) => {
  if (type === "international") return international;
  else return national;
};

export const getAllFlights = async () => {
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
      departureDate1: new Date(`${flightData.departure.date}T${flightData.departure.time}`),
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
  try {
    const response = await fetch(`${backend_url}/flights/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(flightData),
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