"use client";

import { useState, useEffect } from "react";
import { getAvaliableFlights, getAllFligthNews } from "@/services/flights";
import NewsCarousel from "@/components/main/newsCarousel";
import SearchGrid from "@/components/main/searchGrid";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [news, setNews] = useState([]);
  const router = useRouter();

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
      <Box className="w-full flex justify-end my-4">
        <Button variant="contained" onClick={() => router.push("/check-in")}>
          Realizar Check-In
        </Button>
      </Box>
      <SearchGrid data={flights} />
      <NewsCarousel newsItems={news} />
    </main>
  );
}
