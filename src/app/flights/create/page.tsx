import FlightForm from "@/components/flights/flightForm";

export default function createFlight() {
  return (
    <main className="w-4/5 border rounded shadow p-5 w-4/5 mx-auto md:mt-8"
    style={{backgroundColor: "Background"}}>
      <FlightForm />
    </main>
  );
}
