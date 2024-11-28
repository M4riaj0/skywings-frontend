import { CancelTicket } from '@/schemas/tickets';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getPurchases = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return { success: false, message: "No token found" };
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.username;
  try {
    const res = await fetch(`${BACKEND_URL}/purchase/all/${username}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    } else {
      console.error("Error al obtener las compras");
      return { success: false, message: "Error al obtener las compras" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

export const getActiveTickets = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return { success: false, message: "No token found" };
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.username;
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/active/${username}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    } else {
      console.error("Error al obtener los tiquetes activos");
      return { success: false, message: "Error al obtener los tiquetes activos" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

export const getReservationTickets = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return { success: false, message: "No token found" };
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.username;
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/reservations/${username}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    } else {
      console.error("Error al obtener los tiquetes activos");
      return { success: false, message: "Error al obtener los tiquetes activos" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

export const getTicketsHistory = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return { success: false, message: "No token found" };
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.username;
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/history/${username}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    } else {
      console.error("Error al obtener el historial de tiquetes");
      return { success: false, message: "Error al obtener el historial de tiquetes" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

export const getTickets = async (id: number) => {
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/purchase/${id}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      return { success: true, data: await res.json() };
    } else {
      console.error("Error al obtener los tickets");
      return { success: false, message: "Error al obtener los tickets" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

export const cancelTicket = async (ticketData: CancelTicket) => {
  try {
    const res = await fetch(`${BACKEND_URL}/tickets/cancel`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(ticketData),
    });

    if (res.ok) {
      console.log("Tiquete eliminado exitosamente");
      return { success: true, message: "Tiquete eliminado exitosamente", data: await res.json() };
    } else {
      const errorData = await res.json();
      console.error("Error al eliminar el Tiquete", errorData);
      return { success: false, message: errorData.message || "Error al eliminar el Tiquete" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "No pudimos obtener los datos" };
  }
};

