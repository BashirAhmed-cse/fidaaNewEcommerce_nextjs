import Image from "next/image";
import React from "react";

// Define proper types
type CloudinaryImage = {
  public_id: string;
};

type ComboOffer = {
  _id: string;
  title: string;
  images?: CloudinaryImage[];
  // Add other properties you use
};

type SpecialComboData = {
  offers: ComboOffer[];
  message: string;
  success: boolean;
};

const SpecialCombos = ({ comboData }: { comboData: SpecialComboData }) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "dlnncmfdd"; // Fallback for build

  return (
    <div className="container mx-auto px-4 mb-5">
      <h2 className="heading my-2.5 ownContainer text-center uppercase sm:my-10">
        SPECIAL COMBOS
      </h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-5 sm:justify-center scroll-smooth no-scrollbar">
          {comboData.offers.map((combo, index) => {
            const publicId = combo.images?.[0]?.public_id;
            const imageUrl = publicId
              ? `https://res.cloudinary.com/${cloudName}/image/upload/w_600,h_450,c_fill/${publicId}.webp`
              : "/placeholder.svg";

            return (
              <div
                key={combo._id}
                className="flex-shrink-0 w-[80vw] sm:w-[347px]"
              >
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={combo.title || "Special combo image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, 347px"
                    quality={85}
                    priority={index < 3} // Only prioritize first 3
                  />
                </div>
                <p className="text-center uppercase mt-3 font-medium">
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

export default SpecialCombos;