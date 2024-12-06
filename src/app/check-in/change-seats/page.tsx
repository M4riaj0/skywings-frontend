"use client";
import { Suspense, useState } from "react";
import SeatMap from "@/components/check-in/seatMap";
import SeatLegend from "@/components/check-in/seatLegend";
import { useRouter, useSearchParams } from "next/navigation";
import { changeSeat, checkin } from "@/services/checkin";
import { Alert, Snackbar } from "@mui/material";

type Seat = {
  id: number;
  status: "available" | "occupied" | "inhabilited";
  class: "first" | "economy";
};

type FlightData = {
  avaliableFirst: string;
  avaliableTourist: string;
  busyFirst: string;
  busyTourist: string;
  erased: boolean;
  flightCode: string;
  totalFirst: number;
  totalSeats: number;
  totalTourist: number;
  actualSeat: number;
  passengerDni: string;
};

const generateSeats = (flightData: FlightData): Seat[] => {
  const firstClassSeats = flightData.totalFirst;
  const economySeats = flightData.totalTourist;

  const occupiedSeats = [
    ...flightData.busyFirst
      .split(",")
      .map(Number)
      .filter((seat) => !isNaN(seat) && seat !== flightData.actualSeat),
    ...flightData.busyTourist
      .split(",")
      .map(Number)
      .filter((seat) => !isNaN(seat) && seat !== flightData.actualSeat),
  ];

  const inhabilitedSeats =
    flightData.actualSeat <= flightData.totalFirst
      ? Array.from({ length: economySeats }, (_, i) => i + firstClassSeats + 1)
      : Array.from({ length: firstClassSeats }, (_, i) => i + 1);

  const seats: Seat[] = [];

  const addSeats = (
    startId: number,
    count: number,
    seatClass: "first" | "economy"
  ) => {
    for (let i = 0; i < count; i++) {
      const seatId = startId + i;
      seats.push({
        id: seatId,
        status: occupiedSeats.includes(seatId)
          ? "occupied"
          : inhabilitedSeats.includes(seatId)
          ? "inhabilited"
          : "available",
        class: seatClass,
      });
    }
  };

  addSeats(1, firstClassSeats, "first");
  addSeats(firstClassSeats + 1, economySeats, "economy");

  return seats;
};

const ChangeSeatsContent = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const router = useRouter();
  const flightData: FlightData = {
    flightCode: searchParams.get("flightCode") || "",
    avaliableFirst: searchParams.get("avaliableFirst") || "",
    avaliableTourist: searchParams.get("avaliableTourist") || "",
    busyFirst: searchParams.get("busyFirst") || "",
    busyTourist: searchParams.get("busyTourist") || "",
    erased: searchParams.get("erased") === "true",
    totalFirst: Number(searchParams.get("totalFirst")) || 0,
    totalSeats: Number(searchParams.get("totalSeats")) || 0,
    totalTourist: Number(searchParams.get("totalTourist")) || 0,
    actualSeat: Number(searchParams.get("actualSeat")) || 0,
    passengerDni: searchParams.get("passengerDni") || "",
  };

  const seats = generateSeats(flightData);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(flightData.actualSeat);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSeatChange = (seatId: number) => {
    setSelectedSeat(seatId);
  };

  const confirmSeat = async () => {
    if (selectedSeat) {
      try {
        const res1 = await changeSeat(flightData.flightCode, flightData.passengerDni, selectedSeat.toString());
        console.log(res1);
        if (!res1.ok) {
          setSnackBarMessage("Hubo un error al confirmar el asiento."+res1.message);
          setSnackBarSeverity("error");
          setSnackBarOpen(true);
          return;
        }
        await checkin(flightData.flightCode, flightData.passengerDni);
        setSnackBarMessage(`Check in realizado con exito!`);
        setSnackBarSeverity("success");
        setSnackBarOpen(true);
        setTimeout(() => {
          setSnackBarOpen(false);
          router.push(`/`);
        }, 4000);
      } catch (error) {
        console.error("Error al confirmar el asiento:", error);
        setSnackBarMessage("Hubo un error desconocido. Por favor, intenta más tarde.");
        setSnackBarSeverity("error");
      }
    } else {
      setSnackBarMessage("Por favor, selecciona un asiento primero.");
      setSnackBarSeverity("warning");
      setSnackBarOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Selecciona tu Asiento</h1>
      <div
        className="bg-gray-300 rounded-t-full rounded-b-md border-4 shadow-lg p-10 relative"
        style={{
          borderTopLeftRadius: "50% 20%",
          borderTopRightRadius: "50% 20%",
        }}
      >
        <Suspense fallback={<div>Cargando...</div>}>
          <div className="pt-80">
            <SeatMap
              seats={seats}
              onSeatChange={handleSeatChange}
              selectedSeat={selectedSeat}
            />
          </div>
        </Suspense>
      </div>

      <SeatLegend />

      <button
        className="fixed bottom-6 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        onClick={confirmSeat}
      >
        Confirmar Asiento y proceder al checkin
      </button>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackBarOpen(false)}
          severity={snackBarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackBarSeverity === "success"
                ? "#4caf50"
                : snackBarSeverity === "error"
                ? "#f44336"
                : "#2196f3",
            color: "white",
            borderRadius: 2,
            fontSize: "16px",
            boxShadow: 2,
          }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const ChangeSeatsWrapper = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ChangeSeatsContentWrapper />
    </Suspense>
  );
};

const ChangeSeatsContentWrapper = () => {
  const searchParams = useSearchParams();
  return <ChangeSeatsContent searchParams={searchParams} />;
};

export default ChangeSeatsWrapper;
