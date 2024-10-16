
interface Flight {
    code: string;
    origin: string;
    destination: string;
    departureDate1: Date;
  }
  
  interface FlightTableProps {
    flights: Flight[];
    onDeleteFlight: (code: string) => void;
  }
  
  const FlightTable: React.FC<FlightTableProps> = ({ flights, onDeleteFlight }) => {
    const numFlight = flights.length || 0;
    return (
      <div className="overflow-x-auto md:overflow-visible">
        <div className="md:hidden">
          {flights.length === 0 ? (
            <p className="text-center text-gray-500">No hay vuelos disponibles.</p>
          ) : (
            flights.map((flight, index) => (
              <div key={`${flight.code}-${numFlight}-${index}`} className="border rounded p-4 mb-4 bg-white shadow">
                <p><strong>Código:</strong> {flight.code}</p>
                <p><strong>Origen:</strong> {flight.origin}</p>
                <p><strong>Destino:</strong> {flight.destination}</p>
                <p><strong>Horario:</strong> {flight.departureDate1.toISOString().split("T")[0]}</p>
                <div className="flex justify-center mt-4">
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
  
        {/* Vista en tabla para pantallas grandes */}
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
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No hay vuelos disponibles.
                </td>
              </tr>
            ) : (
              flights.map((flight, index) => (
                <tr key={`${flight.code}-${numFlight}-${index}`} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.code}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.origin}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.destination}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{flight.departureDate1.toISOString().split("T")[0]}</td>
                  <td className="px-6 py-4 border-b text-sm flex space-x-2">
                    <button 
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200"
                      onClick={() => onDeleteFlight(flight.code)}
                    >
                      Eliminar
                    </button>
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
  