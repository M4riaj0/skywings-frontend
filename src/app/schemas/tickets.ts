export interface Ticket {
    flightCode: string;
    passengerDni: string;
    username: string;
    purchaseId?: number;
    seatNumber: number;
    price: number;
    creationDate: Date;
    checkIn?: Date;
    numSuitcase: number;
    erased?: boolean;
}

export interface CancelTicket {
    flightCode: string;
    passengerDni: string;
}