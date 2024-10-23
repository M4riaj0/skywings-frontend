import { z } from "zod";

export const flightFormSchema = z
  .object({
    type: z.string().nonempty("Se requiere el tipo de vuelo"),
    origin: z.string().nonempty("Se requiere la ciudad de origen"),
    destination: z.string().nonempty("Se requiere la ciudad de destino"),
    departure: z.object({
      date: z.string().nonempty("Se requiere la fecha de salida ida"),
      time: z.string().nonempty("Se requiere la hora de salida ida"),
    }),
    priceFirstClass: z
      .number()
      .refine((value) => value > 0 && value <= 10000000, {
        message: "El precio debe ser un número entre 1 y 10.000.000",
      }),
    priceEconomyClass: z
      .number()
      .refine((value) => value > 0 && value <= 10000000, {
        message: "El precio debe ser un número entre 1 y 10.000.000",
      }),
  })
  .superRefine((data, ctx) => {
    const type = data.type;
    const departureDate = new Date(
      `${data.departure.date}T${data.departure.time}`
    );
    const currentTime = new Date();
    const hoursToAdd = type === "national" ? 2 : 4;
    const minTimeDeparture = new Date(
      currentTime.getTime() + hoursToAdd * 60 * 60 * 1000
    );
    if (departureDate < minTimeDeparture) {
      ctx.addIssue({
        path: ["departure", "time"],
        code: z.ZodIssueCode.custom,
        message: `La hora de salida debe ser al menos ${hoursToAdd} horas a partir de ahora.`,
      });
    }
  });

export interface FlightForm {
  type: string;
  origin: string;
  destination: string;
  priceFirstClass: number;
  priceEconomyClass: number;
  departure: {
    date: string;
    time: string;
  };
}

export interface FlightFormToSend {
  creator: string;
  type: string;
  origin: string;
  destination: string;
  priceFirstClass: number;
  priceEconomyClass: number;
  departure: Date;
  lastUpdateDate: Date;
}

interface City {
  city: string;
  code: string;
}

export interface ReceivingData {
  capitals?: City[];
  colombia?: City[];
  international?: City[];
}

export type CitiesSchema = City[];