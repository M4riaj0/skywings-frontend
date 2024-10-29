'use client';

import { useState, useEffect } from 'react';
import { getAllFlights } from '@/services/flights';
import NewsCarousel from '@/components/main/newsCarousel';
import SearchGrid from '@/components/main/searchGrid';
// import Image from "next/image";

// export const dynamic = 'force-dynamic';

export default function Home() {

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

  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      setFlights(await getAllFlights());
    };

    fetchFlights();
  }, []);

  return (
    <div className="mt-5 w-full">
      {/* <h1 className="text-4xl font-bold">Bienvenido</h1>
      <Image src="/images/logo.png" alt="Logo" width={200} height={200}/>
      <h3>Más funcionalidades estarán disponibles próximamente</h3> */}
      <NewsCarousel newsItems={newCarouselInfo} />
      <SearchGrid data={flights} />
    </div>
  );
}
