
import NewsCarousel from '@/components/main/newsCarousel';
import SearchGrid from '@/components/main/searchGrid';
// import Image from "next/image";

// export const dynamic = 'force-dynamic';

export default function Home() {
  const flightInfo = {
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
  };

  const newCarouselInfo = [
    {
      // image: "/images/flight1.jpg",
      title: "Flight to Bogotá",
      content: "Enjoy a comfortable flight to Bogotá with our top-notch services."
    },
    {
      // image: "/images/flight2.jpg",
      title: "Flight to Medellín",
      content: "Experience the beauty of Medellín with our exclusive flight deals."
    },
    {
      // image: "/images/flight3.jpg",
      title: "Flight to Cartagena",
      content: "Discover the historic city of Cartagena with our affordable flights."
    }
  ];

  return (
    <div className="mt-5 w-full">
      {/* <h1 className="text-4xl font-bold">Bienvenido</h1>
      <Image src="/images/logo.png" alt="Logo" width={200} height={200}/>
      <h3>Más funcionalidades estarán disponibles próximamente</h3> */}
      <NewsCarousel newsItems={newCarouselInfo} />
      <SearchGrid data={[flightInfo]} />
    </div>
  );
}
