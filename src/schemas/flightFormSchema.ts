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
      .int("El precio debe ser un número entero")
      .refine((value) => value > 999 && value <= 10000000, {
        message: "El precio debe ser un número entre 1 y 10.000.000",
      }),
    priceEconomyClass: z
      .number()
      .int("El precio debe ser un número entero")
      .refine((value) => value > 999 && value <= 10000000, {
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

    if (data.priceEconomyClass >= data.priceFirstClass) {
      ctx.addIssue({
        path: ["priceEconomyClass"],
        code: z.ZodIssueCode.custom,
        message: "El precio de la clase económica debe ser menor que el precio de la primera clase.",
      });
    }
  });

export const flightUpdateSchema = z.object({
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
  discount: z
    .number()
    .int()
    .refine((value) => value >= 0 && value <= 90, {
      message: "El descuento debe ser un número entre 1 y 90",
    }),
}).superRefine((data, ctx) => {
  if (data.priceEconomyClass >= data.priceFirstClass) {
    ctx.addIssue({
      path: ["priceEconomyClass"],
      code: z.ZodIssueCode.custom,
      message: "El precio de la clase económica debe ser menor que el precio de la primera clase.",
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
  departureDate1: Date;
  lastUpdateDate: Date;
}

export interface FlightFormUpdate extends Partial<FlightFormToSend> {
  flightCode: string;
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
  updater: string;
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

export interface FlightSeatData {
  flightCode: string;
  totalSeats: number;
  totalFirst: number;
  totalTourist: number;
  avaliableFirst: string;
  avaliableTourist: string;
  busyFirst: string;
  busyTourist: string;
  erased: boolean;
}
