"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowCircleRightRounded,
  ArrowCircleLeftRounded,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { NewsItem, Card4News } from "./card4News";

interface NewsCarouselProps {
  newsItems: NewsItem[];
  interval?: number;
}

const imageList = [
  "/images/family.png",
  "/images/destination.png",
  "/images/forest.jpg",
  "/images/traveler.png",
  "/images/happiness.jpeg",
  "/images/couple.jpeg",
  "/images/landscape.jpg",
  "/images/family-trip.jpeg",
  "/images/city.jpeg",
];

const NewsCarousel: React.FC<NewsCarouselProps> = ({
  newsItems = [],
  interval = 20000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(2);

  useEffect(() => {
    if (!newsItems) return;

    const assignImage = () => {
      newsItems.map((item, index) => {
        item.image = imageList[index % imageList.length];
      });
    };

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, interval);

    assignImage();
    return () => clearInterval(timer);
  }, [newsItems, interval]);

  if (!newsItems) {
    return (
      <Box className="flex justify-center mt-3 mb-6 text-2xl">
        <p>No hay noticias disponibles</p>
      </Box>
    );
  } else {
    return (
      <section id="news" className="mb-6">
        <h2 className="text-3xl my-3 font-bold text-center">Noticias</h2>
        <div className="news-carousel flex justify-evenly items-center">
          <button
            type="button"
            className="z-30 h-full pl-5 cursor-pointer group focus:outline-none"
            onClick={() =>
              setCurrentIndex(
                (currentIndex - 1 + newsItems.length) % newsItems.length
              )
            }
          >
            <ArrowCircleLeftRounded style={{ fontSize: "2rem" }} />
          </button>
          <div className="news-item">
            <Card4News
              {...newsItems[currentIndex]}
              image={imageList[currentIndex % newsItems.length]}
            />
          </div>
          {newsItems.length > 1 && (
            <div className="news-item hidden md:block">
              <Card4News
                {...newsItems[(currentIndex + 1) % newsItems.length]}
                image={imageList[(currentIndex + 1) % newsItems.length]}
              />
            </div>
          )}
          {newsItems.length > 2 && (
            <div className="news-item hidden lg:block">
              <Card4News
                {...newsItems[(currentIndex + 2) % newsItems.length]}
                image={imageList[(currentIndex + 2) % newsItems.length]}
              />
            </div>
          )}
          <button
            type="button"
            className="z-30 h-full pr-5 cursor-pointer group focus:outline-none"
            onClick={() =>
              setCurrentIndex((currentIndex + 1) % newsItems.length)
            }
          >
            <ArrowCircleRightRounded style={{ fontSize: "2rem" }} />
          </button>
        </div>
      </section>
    );
  }
};

export default NewsCarousel;
