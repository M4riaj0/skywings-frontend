export interface ICard {
    propietary: string;
    number: string;
    cvv: string;
    balance: number;
    type: "debit" | "credit";
    expirationDate: string;
}

export interface changeBalance {
    number: string;
    balance: number;
}


