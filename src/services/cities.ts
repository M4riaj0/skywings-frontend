const cityTimeZoneMap: { [key: string]: string } = {
  "Madrid, España": "Europe/Madrid",
  "Londres, Reino Unido": "Europe/London",
  "New York, Estados Unidos": "America/New_York",
  "Buenos Aires, Argentina": "America/Argentina/Buenos_Aires",
  "Miami, Estados Unidos": "America/New_York",
  "Bogotá, Colombia": "America/Bogota", // Asumiendo Bogotá para vuelos nacionales en Colombia
};

export const formatDateAndTime = (city: string, dateTime: string) => {
  const modifiedCity = city.includes("Colombia") ? `Bogotá, Colombia` : city;
  let timeZone = cityTimeZoneMap[modifiedCity] ;
  timeZone = timeZone ==  "Europe/London" ? 'UTC' : timeZone;
  const [date, time] = dateTime.split("T");
  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: timeZone,
      })
    : "";
  return { date, time: formattedTime };
};

const international = {
  colombia: [
    { city: "Pereira, Colombia", code: "PER" },
    { city: "Bogotá, Colombia", code: "BOG" },
    { city: "Medellín, Colombia", code: "MED" },
    { city: "Cali, Colombia", code: "CAL" },
    { city: "Cartagena, Colombia", code: "CAR" },
  ],
  international: [
    { city: "Madrid, España", code: "MAD" },
    { city: "Londres, Reino Unido", code: "LON" },
    { city: "New York, Estados Unidos", code: "NYC" },
    { city: "Buenos Aires, Argentina", code: "BUE" },
    { city: "Miami, Estados Unidos", code: "MIA" },
  ],
};

const national = {
  capitals: [
    { city: "Bogotá, Colombia", code: "BOG" },
    { city: "Medellín, Colombia", code: "MED" },
    { city: "Cali, Colombia", code: "CAL" },
    { city: "Barranquilla, Colombia", code: "BAR" },
    { city: "Cartagena, Colombia", code: "CAR" },
    { city: "Cúcuta, Colombia", code: "CUC" },
    { city: "Bucaramanga, Colombia", code: "BUC" },
    { city: "Pereira, Colombia", code: "PER" },
    { city: "Manizales, Colombia", code: "MAN" },
    { city: "Ibagué, Colombia", code: "IBA" },
    { city: "Neiva, Colombia", code: "NEI" },
    { city: "Armenia, Colombia", code: "ARM" },
    { city: "Tunja, Colombia", code: "TUN" },
    { city: "Villavicencio, Colombia", code: "VIL" },
    { city: "Popayán, Colombia", code: "POP" },
    { city: "Pasto, Colombia", code: "PAS" },
    { city: "Santa Marta, Colombia", code: "STA" },
    { city: "Sincelejo, Colombia", code: "SIN" },
    { city: "Montería, Colombia", code: "MON" },
    { city: "Valledupar, Colombia", code: "VAL" },
    { city: "Riohacha, Colombia", code: "RIO" },
    { city: "Florencia, Colombia", code: "FLO" },
    { city: "San Andrés, Colombia", code: "SAD" },
    { city: "Leticia, Colombia", code: "LET" },
    { city: "Mocoa, Colombia", code: "MOC" },
    { city: "Mitú, Colombia", code: "MIT" },
    { city: "Puerto Carreño, Colombia", code: "PCA" },
    { city: "Quibdó, Colombia", code: "QUI" },
    { city: "Inírida, Colombia", code: "INI" },
    { city: "Yopal, Colombia", code: "YOP" },
    { city: "Arauca, Colombia", code: "ARA" },
  ],
};

export const getCities = async (type: string) => {
  if (type === "international") return international;
  else return national;
};