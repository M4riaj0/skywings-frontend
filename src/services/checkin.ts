const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;;

export const checkin = async (flightCode: string, passengerDNI: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/checkin`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightCode, passengerDNI}),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

export const changeSeat = async (flightCode: string, passengerDNI: string, seatNumber: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/checkin/change-seat`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightCode, passengerDNI, seatNumber}),
    });
    return response.json();
  } catch (error) {
    return error
  }
}