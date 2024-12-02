"use client";
import { useState } from "react";
import SeatMap from "@/components/check-in/seatMap";
import SeatLegend from "@/components/check-in/seatLegend";

type Seat = {
    id: number;
    status: "available" | "occupied" | "inhabilited";
    class: "first" | "economy";
};

type FlightData = {
    flight: "international" | "national";
    class: "firstClass" | "firstClass";
    actual_seat: number;
    occupied_seats: number[];
};

const generateSeats = (flightData: FlightData): Seat[] => {
    const totalSeats = flightData.flight === "international" ? 250 : 200;
    const firstClassSeats = flightData.flight === "international" ? 50 : 25;
    const economySeats = totalSeats - firstClassSeats;

    // Remove the actual seat from occupied seats
    const occupiedSeats = flightData.occupied_seats.filter(seat => seat !== flightData.actual_seat);

    const inhabilitedSeats = flightData.class === "firstClass"
        ? Array.from({ length: economySeats }, (_, i) => i + firstClassSeats + 1)
        : Array.from({ length: firstClassSeats }, (_, i) => i + 1);

    const seats: Seat[] = [];

    const addSeats = (startId: number, count: number, seatClass: "first" | "economy") => {
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

    // Add first class seats
    addSeats(1, firstClassSeats, "first");

    // Add economy class seats
    addSeats(firstClassSeats + 1, economySeats, "economy");


    return seats;
};

const flightData: FlightData = {
    flight: "national",
    class: "firstClass",
    actual_seat: 6,
    occupied_seats: [1, 2, 3, 4, 5, 35, 33, 32, 100],
};

const seats = generateSeats(flightData);

const ChangeSeats = () => {
    const [selectedSeat, setSelectedSeat] = useState<number | null>(flightData.actual_seat);

    const handleSeatChange = (seatId: number) => {
        setSelectedSeat(seatId);
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Selecciona tu Asiento</h1>
            <SeatLegend />
            <div
                className="bg-gray-300 rounded-t-full rounded-b-md border-4 shadow-lg p-10 relative"
                style={{ borderTopLeftRadius: "50% 20%", borderTopRightRadius: "50% 20%" }}
            >
                <div className="pt-80">
                    <SeatMap
                        seats={seats}
                        onSeatChange={handleSeatChange}
                        selectedSeat={selectedSeat}
                    />
                </div>
            </div>
            {selectedSeat && (
                <div className="mt-4 text-lg">
                    <strong>Asiento seleccionado:</strong> {selectedSeat}
                </div>
            )}
        </div>
    );
};

export default ChangeSeats;
