'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  content: string;
}

interface NewsCarouselProps {
  newsItems: NewsItem[];
  interval?: number;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ newsItems, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, interval);

    return () => clearInterval(timer);
  }, [newsItems.length, interval]);

  return (
    <div className="news-carousel">
      <div className="news-item">
        <h3>{newsItems[currentIndex].title}</h3>
        {newsItems[currentIndex].content}
      </div>
    </div>
  );
};

export default NewsCarousel;