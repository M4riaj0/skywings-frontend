"use client";

import React, { useState } from "react";
import { Grid2, Autocomplete, TextField, Divider, Box } from "@mui/material";
import FligthCard from "./card4Flights";
import { FlightData } from "@/app/schemas/flightFormSchema";

interface SearchGridProps {
  data: FlightData[];
}

const searchOptions = [
  "Origen",
  "Destino",
  "Fecha de salida",
  "Fecha de llegada",
  "Precio",
];

const SearchGrid: React.FC<SearchGridProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState<string | null>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (searchOption === null || searchTerm === "") {
      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (!/^0+$/.test(searchTerm)) {
      switch (searchOption) {
        case "Origen":
          return item.origin.toLowerCase().includes(searchTerm.toLowerCase());
        case "Destino":
          return item.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Fecha de salida":
          return item.departureDate1
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Fecha de llegada":
          return item.arrivalDate1
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Precio":
          return item.priceEconomyClass.toString().includes(searchTerm);
        default:
          return false;
      }
    }
  });

  return (
    <section className="bg-white py-2 px-5 rounded">
      <Box className="flex my-3 space-x-3">
        <Autocomplete
          disablePortal
          id="search-options-select"
          options={searchOptions}
          sx={{ width: 200 }}
          value={searchOption}
          onChange={(event, newValue) => {
            setSearchOption(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Elegir filtro" />
          )}
        />
        <TextField
          id="search"
          type="text"
          placeholder="Buscar..."
          sx={{ width: 200 }}
          value={searchTerm}
          onChange={handleSearchChange}
          error={
            /^0+$/.test(searchTerm) ||
            (searchTerm.length > 0 && filteredData.length === 0)
          }
          helperText={
            /^0+$/.test(searchTerm)
              ? "El término de búsqueda no puede ser una cadena de ceros"
              : searchTerm.length > 0 && filteredData.length === 0
              ? "No se encontraron resultados"
              : ""
          }
        />
      </Box>
      <Divider />
      <Grid2
        className="my-3 rounded"
        container
        spacing={3}
        columns={{ sm: 1, md: 2, lg: 4 }}
        justifyContent="center"
      >
        {filteredData.map((item, index) => (
          <Grid2 key={index}>
            <FligthCard {...item} />
          </Grid2>
        ))}
      </Grid2>
    </section>
  );
};

export default SearchGrid;
