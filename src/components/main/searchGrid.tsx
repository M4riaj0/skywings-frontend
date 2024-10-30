"use client";

import React, { useState } from "react";
import {
  Grid2,
  Autocomplete,
  TextField,
  Divider,
  Box,
  Pagination,
  Button,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FligthCard from "./card4Flights";
import { FlightData } from "@/app/schemas/flightFormSchema";

interface SearchGridProps {
  data: FlightData[];
}

const searchOptions = ["Fecha de salida", "Fecha de llegada", "Precio"];

const SearchGrid: React.FC<SearchGridProps> = ({ data }) => {
  const [searchTerms, setSearchTerms] = useState({ origen: "", destino: "", filter: "" });
  const [searchOption, setSearchOption] = useState<string | null>("");
  const [filteredData, setFilteredData] = useState<FlightData[]>(data);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setSearchTerms(prev => ({ ...prev, [id]: value }));
  };

  const handleSearch = () => {
    const filtered = data.filter(item => {
      const searchFields: { [key: string]: string | number } = {
        "Fecha de salida": item.departureDate1,
        "Fecha de llegada": item.arrivalDate1,
        Precio: item.priceEconomyClass.toString(),
      };
      const matchesSearchOption = searchOption
        ? searchFields[searchOption]?.toString().toLowerCase().includes(searchTerms.filter.toLowerCase())
        : true;
      const matchesOrigin = searchTerms.origen
        ? item.origin.toLowerCase().includes(searchTerms.origen.toLowerCase())
        : true;
      const matchesDestination = searchTerms.destino
        ? item.destination.toLowerCase().includes(searchTerms.destino.toLowerCase())
        : true;
      return matchesSearchOption && matchesOrigin && matchesDestination;
    });

    setFilteredData(filtered);
    setPage(1);
  };

  return (
    <section className="bg-gray-50 py-2 px-5 rounded-lg border-t shadow-md">
      <Box className="flex my-3 space-x-3">
        <Autocomplete
          disablePortal
          id="search-options-select"
          options={searchOptions}
          sx={{ width: 200 }}
          value={searchOption}
          onChange={(event, newValue) => setSearchOption(newValue)}
          renderInput={(params) => <TextField {...params} label="Elegir filtro" />}
        />
        <TextField
          id="filter"
          placeholder="Buscar..."
          sx={{ width: 200 }}
          value={searchTerms.filter}
          onChange={handleSearchChange}
          type={searchOption === "Precio" ? "number" : "date"}
        />
        <TextField
          id="origen"
          label="Origen"
          sx={{ width: 200 }}
          value={searchTerms.origen}
          onChange={handleSearchChange}
        />
        <TextField
          id="destino"
          label="Destino"
          sx={{ width: 200 }}
          value={searchTerms.destino}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          color="primary"
          className="rounded-full"
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
      </Box>
      <Divider />
      {filteredData.length === 0 && (
        <Box className="flex justify-center my-3 text-2xl">
          <p>No se encontraron vuelos disponibles</p>
        </Box>
      )}
      <Grid2 className="my-3 rounded" container columns={1} spacing={2}>
        {filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
          <Grid2 size={1} key={index}>
            <FligthCard {...item} />
          </Grid2>
        ))}
      </Grid2>
      <Box className="flex justify-center my-3">
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>
    </section>
  );
};

export default SearchGrid;
