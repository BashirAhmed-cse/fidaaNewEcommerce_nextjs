"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import Image from "next/image";

interface BannerCarouselProps {
  desktopImages: string[];
  mobileImages?: string[]; // optional, may be undefined or empty
}

const BannerCarousel = ({ desktopImages, mobileImages }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Use mobileImages only if:
  // - isMobile is true
  // - mobileImages is defined and not empty
  // Else fallback to desktopImages
  const images =
    isMobile && Array.isArray(mobileImages) && mobileImages.length > 0
      ? mobileImages
      : desktopImages;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 485);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const interval = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[400px]  overflow-hidden mb-6 rounded-lg shadow-md">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-[400px]">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 100vw"
              quality={90}
            />
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full shadow-sm transition duration-200"
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/60 hover:bg-white text-black rounded-full shadow-sm transition duration-200"
      >
        <ChevronRight size={24} />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
