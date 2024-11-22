export interface IPassenger {
  dni: string;
  name1: string;
  name2?: string;
  surname1: string;
  surname2?: string;
  birthDate: Date;
  gender: string;
  phone: string;
  email: string
  contactName: string;
  contactPhone: string
}

export interface ITicket {
  flightCode: string;
  type: string;
  class: string;
  price: number;
  passenger?: IPassenger;
}

export interface ICartItem {
  flight: {
    code: string;
    departure: string;
    arrival: string;
    departureDate: string;
    arrivalDate: string;
  };
  tickets: ITicket[];
}

export interface buyTickets {
  flightCode: string;
  passengerDni: string;
  cardNumber: string;
  cvv: string;
}