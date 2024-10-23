import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FlightDetailsDialog from '@/components/flights/flightDetailsDialog'
import { Delete, Edit } from '@mui/icons-material';

interface FlightTableProps {
  flights: Flight[];
  onDeleteFlight: (code: string) => void;
}

interface Flight {
  code: string,
  creator: string,
  type: string,
  origin: string,
  destination: string,
  priceFirstClass: number,
  priceEconomyClass: number,
  departureDate1:  string,
  arrivalDate1:  string,
  departureDate2:  string,
  arrivalDate2:  string,
  creationDate:  string,
  lastUpdateDate:  string,
  erased: boolean
}

const flightsData = [
  {
      code: "SW472BOGMED",
      creator: "admin1",
      type: "national",
      origin: "Bogotá, Colombia",
      destination: "Medellín, Colombia",
      priceFirstClass: 400000,
      priceEconomyClass: 200000,
      departureDate1: "2024-11-20T07:30:00.000Z",
      arrivalDate1: "2024-11-20T09:30:00.000Z",
      departureDate2: "2024-11-25T07:30:00.000Z",
      arrivalDate2: "2024-11-20T09:30:00.000Z",
      creationDate: "2024-10-13T08:00:00.000Z",
      lastUpdateDate: "2024-10-14T14:45:00.000Z",
      erased: false
  },
  {
      code: "SW486BOGMAD",
      creator: "admin1",
      type: "international",
      origin: "Bogotá, Colombia",
      destination: "Madrid, España",
      priceFirstClass: 400000,
      priceEconomyClass: 200000,
      departureDate1: "2024-11-20T07:30:00.000Z",
      arrivalDate1: "2024-11-22T09:30:00.000Z",
      departureDate2: "2024-11-29T07:30:00.000Z",
      arrivalDate2: "2024-11-29T09:30:00.000Z",
      creationDate: "2024-10-13T08:00:00.000Z",
      lastUpdateDate: "2024-10-14T14:45:00.000Z",
      erased: false
  }
];

const FlightTable: React.FC<FlightTableProps> = ({ flights, onDeleteFlight }) => {
  flights = flightsData;
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (flight: Flight) => {
    setSelectedFlight(flight);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFlight(null);
    setDialogOpen(false);
  };

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <FlightDetailsDialog open={isDialogOpen} onClose={handleCloseDialog} flight={selectedFlight} />
      
      <div className="md:hidden">
        {flights.length === 0 ? (
          <p className="text-center text-gray-500">No hay vuelos disponibles.</p>
        ) : (
          flights.map((flight, index) => (
            <div key={`${flight.code}-${index}`} className="border rounded p-4 mb-4 bg-white shadow">
              <p><strong>Código:</strong> {flight.code}</p>
              <p><strong>Origen:</strong> {flight.origin}</p>
              <p><strong>Destino:</strong> {flight.destination}</p>
              <p><strong>Horario:</strong> {flight.departureDate1.split('T')[0]}</p>
              <div className="flex justify-between mt-4">
                <IconButton aria-label="info" onClick={() => handleOpenDialog(flight)}>
                  <InfoIcon />
                </IconButton>
                <button 
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200"
                  onClick={() => onDeleteFlight(flight.code)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <table className="hidden md:min-w-full md:bg-white md:border md:border-gray-300 md:table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Código</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Origen</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Destino</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Horario</th>
            <th className="px-6 py-3 border-b-2 text-left text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {flights.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                No hay vuelos disponibles.
              </td>
            </tr>
          ) : (
            flights.map((flight, index) => (
              <tr key={`${flight.code}-${index}`} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.code}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.origin}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.destination}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.departureDate1.split('T')[0]}</td>
                <td className="px-6 py-4 border-b text-sm flex space-x-2">

                  <Tooltip title="ver detalles">
                    <IconButton aria-label="info" size="small" onClick={() => handleOpenDialog(flight)}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="editar">
                    <IconButton color="primary"  size="small" aria-label="editar" onClick={() => handleOpenDialog(flight)}>
                    <Edit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="borrar">
                    <IconButton color="error"  size="small" aria-label="borrar" onClick={() => onDeleteFlight(flight.code)}>
                      <Delete  />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
