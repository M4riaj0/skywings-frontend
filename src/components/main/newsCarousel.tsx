"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowCircleRightRounded,
  ArrowCircleLeftRounded,
} from "@mui/icons-material";
import {NewsItem, Card4News} from "./card4News";

interface NewsCarouselProps {
  newsItems: NewsItem[];
  interval?: number;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({
  newsItems,
  interval = 20000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    if (newsItems.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, interval);

    return () => clearInterval(timer);
  }, [newsItems.length, interval]);

  if (newsItems.length === 0) {
    return <div className="news-carousel">No hay noticias disponibles</div>;
  }

  return (
    <section id="news" className="mb-4">
      <h2 className="text-3xl my-3 font-bold text-center">Noticias</h2>
      <div className="news-carousel flex justify-evenly items-center">
        <button
          type="button"
          className="z-30 h-full px-6 cursor-pointer group focus:outline-none"
          onClick={() =>
            setCurrentIndex(
              (currentIndex - 1 + newsItems.length) % newsItems.length
            )
          }
        >
          <ArrowCircleLeftRounded style={{ fontSize: "2rem" }} />
        </button>
        <div className="news-item">
          <Card4News {...newsItems[currentIndex]} />
        </div>
        <div className="news-item hidden md:block">
          <Card4News {...newsItems[(currentIndex + 1) % newsItems.length]} />
        </div>
        <div className="news-item hidden lg:block">
          <Card4News {...newsItems[(currentIndex + 2) % newsItems.length]} />
        </div>
        <button
          type="button"
          className="z-30 h-full px-6 cursor-pointer group focus:outline-none"
          onClick={() => setCurrentIndex((currentIndex + 1) % newsItems.length)}
        >
          <ArrowCircleRightRounded style={{ fontSize: "2rem" }} />
        </button>
      </div>
    </section>
  );
};

export default NewsCarousel;