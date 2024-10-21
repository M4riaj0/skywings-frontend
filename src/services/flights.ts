const international = {
  "origin": [
    { "city": "Pereira, Colombia", "code": "PER" },
    { "city": "Bogotá, Colombia", "code": "BOG" },
    { "city": "Medellín, Colombia", "code": "MED" },
    { "city": "Cali, Colombia", "code": "CAL" },
    { "city": "Cartagena, Colombia", "code": "CAR" }
  ],
  "destination": [
    { "city": "Madrid, España", "code": "MAD" },
    { "city": "Londres, Reino Unido", "code": "LON" },
    { "city": "New York, Estados Unidos", "code": "NYC" },
    { "city": "Buenos Aires, Argentina", "code": "BUE" },
    { "city": "Miami, Estados Unidos", "code": "MIA" }
  ]
}

const national = {
  "capitals": [
    { "city": "Bogotá, Colombia", "code": "BOG" },
    { "city": "Medellín, Colombia", "code": "MED" },
    { "city": "Cali, Colombia", "code": "CAL" },
    { "city": "Barranquilla, Colombia", "code": "BAR" },
    { "city": "Cartagena, Colombia", "code": "CAR" },
    { "city": "Cúcuta, Colombia", "code": "CUC" },
    { "city": "Bucaramanga, Colombia", "code": "BUC" },
    { "city": "Pereira, Colombia", "code": "PER" },
    { "city": "Manizales, Colombia", "code": "MAN" },
    { "city": "Ibagué, Colombia", "code": "IBA" },
    { "city": "Neiva, Colombia", "code": "NEI" },
    { "city": "Armenia, Colombia", "code": "ARM" },
    { "city": "Tunja, Colombia", "code": "TUN" },
    { "city": "Villavicencio, Colombia", "code": "VIL" },
    { "city": "Popayán, Colombia", "code": "POP" },
    { "city": "Pasto, Colombia", "code": "PAS" },
    { "city": "Santa Marta, Colombia", "code": "STA" },
    { "city": "Sincelejo, Colombia", "code": "SIN" },
    { "city": "Montería, Colombia", "code": "MON" },
    { "city": "Valledupar, Colombia", "code": "VAL" },
    { "city": "Riohacha, Colombia", "code": "RIO" },
    { "city": "Florencia, Colombia", "code": "FLO" },
    { "city": "San Andrés, Colombia", "code": "SAD" },
    { "city": "Leticia, Colombia", "code": "LET" },
    { "city": "Mocoa, Colombia", "code": "MOC" },
    { "city": "Mitú, Colombia", "code": "MIT" },
    { "city": "Puerto Carreño, Colombia", "code": "PCA" },
    { "city": "Quibdó, Colombia", "code": "QUI" },
    { "city": "Inírida, Colombia", "code": "INI" },
    { "city": "Yopal, Colombia", "code": "YOP" },
    { "city": "Arauca, Colombia", "code": "ARA" }
  ]
}

export const getLocations = async (type: string) => {
  if (type === 'international') return international;
  else return national;
}
