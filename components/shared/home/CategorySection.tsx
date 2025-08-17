import Image from "next/image";
import React from "react";

type SubCategory = {
  name: string;
  images?: {
    url?: string;
    public_id?: string;
  }[];
};


type subcategoriesDataType = {
  subCategories: SubCategory[];
  message: string;
  success: boolean;
};

const cloudName = process.env.CLOUDINARY_NAME;

const CategorySection = ({
  subCategoryData,
}: {
  subCategoryData: subcategoriesDataType;
}) => {
  if (!subCategoryData?.subCategories?.length) {
    return <div className="text-center text-gray-500">No categories found.</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        LUXURY CATEGORIES
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subCategoryData.subCategories.map((category, index) => {
          const imageObj = category.images?.[0];
          const imageUrl = imageObj?.url
            ? imageObj.url
            : imageObj?.public_id
            ? `https://res.cloudinary.com/${cloudName}/image/upload/${imageObj.public_id}.webp`
            : "/placeholder.svg";

          return (
            <div key={index} className="flex flex-col items-center">
              {/* <div className="bg-gray-100">
                <img
                  src={imageUrl}
                  alt={category.name}
                  className="w-full h-auto object-cover"
                />
              </div> */}
              <div className="bg-gray-100">
  <Image
    src={imageUrl}
    alt={category.name || "Category image"}
    width={800}  // Set your desired dimensions
    height={600}
    className="w-full h-auto object-cover"
    quality={80}
  />
</div>
              <span className="text-sm font-medium text-center">
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;
