import { z } from "zod";

export const flightFormSchema = z.object({
  type: z.string().nonempty("Se requiere el tipo de vuelo"),
  origin: z.string().nonempty("Se requiere la ciudad de origen"),
  destination: z.string().nonempty("Se requiere la ciudad de destino"),
  departure1: z.object({
    date: z.string().nonempty("Se requiere la fecha de salida ida"),
    hour: z.string().nonempty("Se requiere la hora de salida ida"),
  }),
  arrival1: z.object({
    date: z.string().nonempty("Se requiere la fecha de llegada ida"),
    hour: z.string().nonempty("Se requiere la hora de llegada ida"),
  }),
  departure2: z.object({
    date: z.string().nonempty("Se requiere la fecha de salida ida"),
    hour: z.string().nonempty("Se requiere la hora de salida ida"),
  }),
  arrival2: z.object({
    date: z.string().nonempty("Se requiere la fecha de llegada ida"),
    hour: z.string().nonempty("Se requiere la hora de llegada ida"),
  }),
  priceFirstClass: z
    .number()
    .min(0, "Se requiere el precio de primera clase")
    .max(10000000,
      "El precio de primera clase no puede ser mayor a 10.000.000"),
  priceEconomyClass: z
    .number()
    .min(0, "Se requiere el precio de clase económica")
    .max(10000000,
      "El precio de clase económica no puede ser mayor a 10.000.000"),
});

interface DepartureArrival {
  date: string;
  time: string;
}

export interface FlightForm {
  type: string;
  origin: string;
  destination: string;
  departure1: DepartureArrival;
  arrival1?: DepartureArrival;
  departure2: DepartureArrival;
  arrival2?: DepartureArrival;
  priceFirstClass: number;
  priceEconomyClass: number;
  creationDate: string;
}

export interface ReceivingLocations {
  origin?: Array<string>,
  destination?: Array<string>,
  capitals?: Array<string>
}