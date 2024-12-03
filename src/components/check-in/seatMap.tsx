interface Seat {
  id: number;
  status: "occupied" | "available" | "inhabilited";
  class: "first" | "economy";
}

interface SeatMapProps {
  seats: Seat[];
  onSeatChange: (seatId: number) => void;
  selectedSeat: number | null;
}

const SeatMap = ({ seats, onSeatChange, selectedSeat }: SeatMapProps) => {
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "inhabilited") return; // Bloquear asientos ocupados e inhabilitados
    onSeatChange(seat.id);
  };

  const renderSeat = (seat: Seat) => (
    <button
      key={seat.id}
      onClick={() => handleSeatClick(seat)}
      className={`relative w-10 h-14 sm:w-8 sm:h-12 md:w-10 md:h-14 rounded-lg border-2 flex items-center justify-center 
      ${
        seat.status === "inhabilited"
          ? "bg-yellow-500 cursor-not-allowed border-yellow-700"
          : seat.status === "occupied"
          ? "bg-red-500 cursor-not-allowed border-red-700"
          : selectedSeat === seat.id
          ? "bg-blue-500 border-blue-700"
          : seat.status === "available"
          ? "bg-green-500 hover:bg-green-600 border-green-700"
      : ""}`}
    >
      <span className="text-white text-xs font-bold">{seat.id}</span>
    </button>
  );

  // Agrupar asientos por clase
  const firstClassSeats = seats.filter((seat) => seat.class === "first");
  const economySeats = seats.filter((seat) => seat.class === "economy");

  const groupSeatsByRow = (seatGroup: Seat[]) =>
    Array.from({ length: Math.ceil(seatGroup.length / 4) }, (_, i) =>
      seatGroup.slice(i * 5, (i + 1) * 5)
    );

  return (
    <div className="space-y-6">
      {/* Primera Clase */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-center">Primera Clase</h2>
        <div className="space-y-4">
          {groupSeatsByRow(firstClassSeats).map((row, idx) => (
            <div key={idx} className="flex items-center gap-2 sm:gap-1 md:gap-2 justify-center">
              <div className="grid grid-cols-3 gap-2 sm:gap-1 md:gap-2">
                {row.slice(0, 2).map((seat) => renderSeat(seat))}
              </div>
              <div className="w-6 sm:w-2 md:w-6" />
              <div className="grid grid-cols-3 gap-2 sm:gap-1 md:gap-2">
                {row.slice(2).map((seat) => renderSeat(seat))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clase Económica */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-center">Clase Económica</h2>
        <div className="space-y-4">
          {groupSeatsByRow(economySeats).map((row, idx) => (
            <div key={idx} className="flex items-center gap-2 sm:gap-1 md:gap-2 justify-center">
              <div className="grid grid-cols-3 gap-2 sm:gap-1 md:gap-2">
                {row.slice(0, 2).map((seat) => renderSeat(seat))}
              </div>
              <div className="w-6 sm:w-2 md:w-6" />
              <div className="grid grid-cols-3 gap-2 sm:gap-1 md:gap-2">
                {row.slice(2).map((seat) => renderSeat(seat))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
