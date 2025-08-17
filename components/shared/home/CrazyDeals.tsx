import Image from "next/image";
import React from "react";

// Define minimal types for Cloudinary image
type CloudinaryImage = {
  public_id: string;
};

// Define minimal deal offer type
type DealOffer = {
  _id: string;
  title: string;
  images?: CloudinaryImage[];
  // Add other properties you actually use
};

// Props type for the component
type CrazyDealsProps = {
  dealData: {
    offers: DealOffer[];
    message: string;
    success: boolean;
  };
};

const CrazyDeals = ({ dealData }: CrazyDealsProps) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "dlnncmfdd"; // Fallback to default

  return (
    <div className="container mx-auto px-4 mb-5">
      <h2 className="heading my-2.5 ownContainer text-center uppercase sm:my-10">
        Crazy Deals
      </h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-5 sm:justify-center scroll-smooth no-scrollbar">
          {dealData.offers.map((combo, index) => {
            const publicId = combo.images?.[0]?.public_id;
            const imageUrl = publicId
              ? `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.webp`
              : "/placeholder.svg";

            return (
              <div
                key={combo._id}
                className="flex-shrink-0 w-[80vw] sm:w-[347px]"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={imageUrl}
                    alt={combo.title || "Special combo image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 3}
                  />
                </div>
                <p className="text-center uppercase textGap font-medium">
                  {combo.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CrazyDeals;