"use client";

import { useState, useEffect } from "react";
import { getAvaliableFlights, getAllFligthNews } from "@/services/flights";
import NewsCarousel from "@/components/main/newsCarousel";
import SearchGrid from "@/components/main/searchGrid";

export const dynamic = "force-dynamic";

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      setFlights(await getAvaliableFlights());
    };

    const fetchNews = async () => {
      setNews(await getAllFligthNews());
    };

    fetchFlights();
    fetchNews();
  }, []);

  return (
    <main className="mt-5 w-full">
        <h1 className="text-3xl font-bold text-center mb-4">
          Vuela con nosotros
        </h1>
        <SearchGrid data={flights} />
        <NewsCarousel newsItems={news} />
    </main>
  );
}
