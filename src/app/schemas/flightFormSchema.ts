import { z } from "zod";
import { DateTime } from "luxon"; // Luxon para facilitar el manejo de zonas horarias

const cityTimeZoneMap: { [key: string]: string } = {
  "Madrid, España": "Europe/Madrid",
  "Londres, Reino Unido": "Europe/London",
  "New York, Estados Unidos": "America/New_York",
  "Buenos Aires, Argentina": "America/Argentina/Buenos_Aires",
  "Miami, Estados Unidos": "America/New_York",
  "Bogotá, Colombia": "America/Bogota", // Asumiendo Bogotá para vuelos nacionales en Colombia
};

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
    const { type, origin, departure } = data;

    // Obtiene la zona horaria de la ciudad de origen
    const originModified = origin.includes("Colombia")
      ? `Bogotá, Colombia`
      : origin;
    const originTimeZone = cityTimeZoneMap[originModified];

    if (!originTimeZone) {
      ctx.addIssue({
        path: ["origin"],
        code: z.ZodIssueCode.custom,
        message: `No se encontró la zona horaria para la ciudad de origen: ${origin}.`,
      });
      return;
    }

    // Fecha y hora de salida en la zona horaria del origen
    const departureDateTime = DateTime.fromISO(
      `${departure.date}T${departure.time}`,
      {
        zone: originTimeZone,
      }
    );
    const currentTime = DateTime.now();
    const hoursToAdd = type === "national" ? 2 : 4;

    // Calcula el tiempo mínimo permitido en la zona horaria local
    const minTimeDeparture = currentTime.plus({ hours: hoursToAdd });

    if (departureDateTime < minTimeDeparture) {
      ctx.addIssue({
        path: ["departure", "time"],
        code: z.ZodIssueCode.custom,
        message: `La hora de salida debe ser al menos ${hoursToAdd} horas a partir de ahora, considerando la zona horaria de la ciudad de origen.`,
      });
    }
  });

export const flightUpdateSchema = z.object({
  code: z.string().nonempty("Se requiere el código del vuelo"),
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
  discountEconomy: z
    .number()
    .int()
    .refine((value) => value > 0 && value <= 90, {
      message: "El descuento debe ser un número entre 1 y 90",
    })
    .optional(),
  discountFirstClass: z
    .number()
    .int()
    .refine((value) => value > 0 && value <= 90, {
      message: "El descuento debe ser un número entre 1 y 90",
    })
    .optional(),
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
  departureDate1: Date;
  lastUpdateDate: Date;
}

export interface FlightFormUpdate {
  code: string;
  priceFirstClass: number;
  priceEconomyClass: number;
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

export interface FlightData {
  code: string;
  creator: string;
  type: string;
  origin: string;
  destination: string;
  priceFirstClass: number;
  priceEconomyClass: number;
  departureDate1: string;
  arrivalDate1: string;
  creationDate: string;
  lastUpdateDate: string;
  erased: boolean;
}
