import React from "react";

import BannerCarousel from "@/components/shared/home/BannerCarousel";
import CategorySection from "@/components/shared/home/CategorySection";
import CrazyDeals from "@/components/shared/home/CrazyDeals";
import NeedOfWebsite from "@/components/shared/home/NeedOfWebsite";
import ProductCard from "@/components/shared/home/ProductCard";
import ReviewSection from "@/components/shared/home/ReviewSection";
import SpecialCombos from "@/components/shared/home/SpecialCombos";

import { fetchAllWebsiteBanners } from "@/lib/database/actions/banners.actions";
import {
  getAllCrazyDealOffers,
  getAllSpecialComboOffers,
} from "@/lib/database/actions/homescreenoffers.actions";
import {
  getAllFeaturedProducts,
  getNewArrivalProducts,
  getTopSellingProducts,
} from "@/lib/database/actions/product.actions";
import { getAllSubCategoriesByName } from "@/lib/database/actions/subCategory.actions";
import FeaturedProducts from "@/components/shared/home/FeaturedProducts";

// ✅ Define proper product type
type SubProduct = {
  images: { url: string }[];
  price: number;
  originalPrice?: number;
  discount?: number;
  isSale?: boolean;
  sizes?: { price: number }[];
};

type ProductType = {
  _id: string;
  name: string;
  category: string;
  subProducts: SubProduct[];
  rating: number;
  numReviews: number;
  featured: boolean;
  slug: string;
};

const HomePage = async () => {
  const desktopImages = await fetchAllWebsiteBanners().catch((err) => {
    console.error(err);
    return [];
  });

  const specialCombosHomeData = await getAllSpecialComboOffers().catch((err) => {
    console.error(err);
    return { offers: [], message: "", success: false };
  });

  const creazyDealsData = await getAllCrazyDealOffers().catch((err) => {
    console.error(err);
    return { offers: [], message: "", success: false };
  });

  const subcategoriesData = await getAllSubCategoriesByName("Logo").catch((err) => {
    console.error(err);
    return { subCategories: [], message: "", success: false };
  });

  const topSellingProducts = await getTopSellingProducts().catch((err) => {
    console.error(err);
    return { products: [], message: "", success: false };
  });

  const newArrivalProducts = await getNewArrivalProducts().catch((err) => {
    console.error(err);
    return { products: [], message: "", success: false };
  });

  // ✅ Transform Best Seller Products
  const transformedBestSellerProducts = (topSellingProducts?.products as ProductType[])?.map(
    (product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      image: product.subProducts[0]?.images[0]?.url || "",
      rating: product.rating,
      reviews: product.numReviews,
      price: product.subProducts[0]?.price || 0,
      originalPrice: product.subProducts[0]?.originalPrice || 0,
      discount: product.subProducts[0]?.discount || 0,
      isBestseller: product.featured,
      isSale: product.subProducts[0]?.isSale || false,
      slug: product.slug,
      prices:
        product.subProducts[0]?.sizes?.map((s) => s.price).sort((a, b) => a - b) || [],
    })
  );

  // ✅ Transform New Arrival Products
  const transformedNewArrivalProducts = (newArrivalProducts?.products as ProductType[])?.map(
    (product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      image: product.subProducts[0]?.images[0]?.url || "",
      rating: product.rating,
      reviews: product.numReviews,
      price: product.subProducts[0]?.price || 0,
      originalPrice: product.subProducts[0]?.originalPrice || 0,
      discount: product.subProducts[0]?.discount || 0,
      isBestseller: product.featured,
      isSale: product.subProducts[0]?.isSale || false,
      slug: product.slug,
      prices:
        product.subProducts[0]?.sizes?.map((s) => s.price).sort((a, b) => a - b) || [],
    })
  );
  const featuredProducts: any = await getAllFeaturedProducts().catch((err) =>{
    console.log(err);
   return { products: [], message: "", success: false };
});
  return (
    <div>
      <BannerCarousel desktopImages={desktopImages ?? []} />

      {/* <SpecialCombos
        comboData={specialCombosHomeData ?? { offers: [], message: "", success: false }}
      /> */}

      
<ProductCard heading="NEW ARRIVALS" products={transformedNewArrivalProducts} />
      {/* <CategorySection
        subCategoryData={
          subcategoriesData ?? { subCategories: [], message: "", success: false }
        }
      /> */}
<FeaturedProducts products={featuredProducts.featuredProducts} />
      {/* <CrazyDeals
        dealData={creazyDealsData ?? { offers: [], message: "", success: false }}
      /> */}

      
      <ProductCard heading="BEST SELLERS" products={transformedBestSellerProducts} />

      <ReviewSection />
      <NeedOfWebsite />
 
    </div>
  );
};

export default HomePage;
