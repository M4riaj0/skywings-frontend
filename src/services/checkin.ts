const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getTicket = async (flightCode: string, passengerDni: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tickets/ticket/${flightCode}/${passengerDni}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      const text = await response.text();
      throw new Error(text);
    }
  } catch (error) {
    throw error;
  }
}

export const checkin = async (flightCode: string, passengerDni: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/checkin`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightCode, passengerDni}),
    });
    console.log("response checkin::::", response);
    if (response.ok) {
      return response;
    } else {
      return response.json();
    }
  } catch (error) {
    throw error;
  }
}

export const changeSeat = async (flightCode: string, passengerDni: string, seatNumber: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/checkin/change-seat`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightCode, passengerDni, seatNumber}),
    });
    console.log("response seats::::", response);
    if (response.ok) {
      return response;
    } else {
      return response.json();
    }
  } catch (error) {
    return error
  }
}