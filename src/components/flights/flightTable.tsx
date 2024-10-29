import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Delete, Edit } from '@mui/icons-material';
import { FlightData } from '@/app/schemas/flightFormSchema';
import FlightDetailsDialog from '@/components/flights/flightDetailsDialog';
import FlightEditForm from './flightEditForm';

interface FlightTableProps {
  flights: FlightData[];
  onDeleteFlight: (code: string) => void;
  onSaveFlight: (updatedFlight: FlightData) => void; // Nuevo prop para guardar cambios
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
  flights =  flights !== null ? flights : flightsData;
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenDetailsDialog = (flight: FlightData) => {
    setSelectedFlight(flight);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedFlight(null);
    setDetailsDialogOpen(false);
  };

  const handleOpenEditDialog = (flight: FlightData) => {
    setSelectedFlight(flight);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedFlight(null);
    setEditDialogOpen(false);
  };

  const handleSave = (updatedFlight: { priceEconomyClass: number; priceFirstClass: number }) => {
    if (selectedFlight) {
      onSaveFlight({
        ...selectedFlight,
        priceEconomyClass: updatedFlight.priceEconomyClass,
        priceFirstClass: updatedFlight.priceFirstClass,
      });
      handleCloseEditDialog();
    }
  };

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <FlightDetailsDialog open={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} flight={selectedFlight} />

      {isEditDialogOpen && selectedFlight && (
        <FlightEditForm
          flight={selectedFlight}
          onSave={handleSave}
          onClose={handleCloseEditDialog} open={true}        />
      )}

      {/* Vista en Cards para pantallas pequeñas */}
      <div className="md:hidden">
        {flights.length === 0 ? (
          <p className="text-center text-gray-500">No hay vuelos disponibles.</p>
        ) : (
          flights.map((flight, index) => (
            <div key={`${flight.code}-${index}`} className="border rounded p-4 mb-4 bg-white shadow">
              {/* Encabezado del vuelo */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-600">{flight.code}</h3>
                <div className="flex space-x-2">
                  <Tooltip title="Ver detalles">
                    <IconButton aria-label="info" size="small" onClick={() => handleOpenDetailsDialog(flight)}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton color="primary" size="small" aria-label="editar" onClick={() => handleOpenEditDialog(flight)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Borrar">
                    <IconButton color="error" size="small" aria-label="borrar" onClick={() => onDeleteFlight(flight.code)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              {/* Detalles del vuelo */}
              <p className="text-gray-700"><strong>Origen:</strong> {flight.origin}</p>
              <p className="text-gray-700"><strong>Destino:</strong> {flight.destination}</p>
              <p className="text-gray-700"><strong>Horario:</strong> {flight.departureDate1.split('T')[0]}</p>
            </div>
          ))
        )}
      </div>

      {/* Vista en Tabla para pantallas grandes */}
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
                  <Tooltip title="Ver detalles">
                    <IconButton aria-label="info" size="small" onClick={() => handleOpenDetailsDialog(flight)}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton color="primary" size="small" aria-label="editar" onClick={() => handleOpenEditDialog(flight)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Borrar">
                    <IconButton color="error" size="small" aria-label="borrar" onClick={() => onDeleteFlight(flight.code)}>
                      <Delete />
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
