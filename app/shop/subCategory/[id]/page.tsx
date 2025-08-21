// ISR(CACHE) - 30 MINUTES

import ProductCard from "@/components/shared/home/ProductCard";
import { getRelatedProductsBySubCategoryIds } from "@/lib/database/actions/product.actions";
import React from "react";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import IdInvalidError from "@/components/shared/IdInvalidError";

// Define response type
interface ProductsResponse {
  success: boolean;
  products: any[];
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const search = await searchParams;
  const subCategoryNameRaw = search.name;
  const subCategoryName = Array.isArray(subCategoryNameRaw)
    ? subCategoryNameRaw[0]
    : subCategoryNameRaw || "";

  return {
    title: `Buy ${subCategoryName} Products | OurSham`,
    description: `Shop all ${subCategoryName} products.`,
  };
}

const SubCategoryProductsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search = await searchParams;
  const subCategoryNameRaw = search.name;
  const subCategoryName = Array.isArray(subCategoryNameRaw)
    ? subCategoryNameRaw[0]
    : subCategoryNameRaw || "";

  // checking if the ID is valid Object ID
  const id = (await params).id;
  if (!ObjectId.isValid(id)) {
    return <IdInvalidError />;
  }

  // Ensure we always get a consistent response object
  const products: ProductsResponse = await getRelatedProductsBySubCategoryIds([id]).catch(
    (err) => {
      console.error(err);
      return { success: false, products: [] };
    }
  );

  // If not found or failed
  if (!products.success || !products.products.length) {
    return <IdInvalidError />;
  }

  // Transform products
  const transformedSubCategoryProducts = products.products.map((product: any) => ({
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
      product.subProducts[0]?.sizes
        .map((s: any) => s.price)
        .sort((a: number, b: number) => a - b) || [],
  }));

  return (
    <div>
      <ProductCard
        shop={true}
        products={transformedSubCategoryProducts}
        heading={subCategoryName || "Products"}
      />
    </div>
  );
};

export default SubCategoryProductsPage;
