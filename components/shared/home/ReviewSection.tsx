"use client";

import { getAllProductReviews } from "@/lib/database/actions/product.actions";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { CiInstagram } from "react-icons/ci";


type Review = {
  id: string;
  name: string;
  instagram?: string;
  image: string;
  rating: number;
  text: string;
};

const ReviewSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getAllProductReviews(6); // Limit to latest 6
        if (res.success) {
          setReviews(res.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-10">No customer reviews yet.</div>;
  }



  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="mb-12 heading text-center">
        WHAT OUR CUSTOMERS HAVE TO SAY
      </h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((review) => (
              <div key={review.id} className="flex-[0_0_100%] min-w-0 px-4">
                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-6 rounded-full overflow-hidden">
                    <Image
                      src={review.image}
                      alt={`${review.name}'s profile`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, index: number) => (
                      <Star
                        key={index}
                        className={`w-6 h-6 ${
                          index < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center mb-6 text-lg">{review.text}</p>
                  <p className="font-semibold text-xl mb-1">{review.name}</p>
                  {review.instagram && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <CiInstagram size={15} />
                      {review.instagram}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent rounded-full p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
