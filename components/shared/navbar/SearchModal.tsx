"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import {
  getProductsByQuery,
  getTopSellingProducts,
} from "@/lib/database/actions/product.actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

type ProductType = {
  slug: string;
  name: string;
  subProducts: {
    images: { url: string }[];
    discount: number;
    sizes: { price: number }[];
  }[];
};

const SearchModal = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const trendingSearches = [
    "Perfume",
    "Bath & Body",
    "Gifting",
    "Crazy Deals",
    "Combos",
  ];

  // ✅ Load top-selling products on first render
  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const res = await getTopSellingProducts();
        if (res?.success) {
          setProducts(res.products);
        } else {
          setProducts([]);
          toast.error(res?.message || "Something went wrong.");
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchBestSellerProducts();
  }, []);

  // ✅ Debounced query search (prevents spamming API on every keystroke)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length === 0) return;
      try {
        setLoading(true);
        const res = await getProductsByQuery(query);
        if (res?.success) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const displayProducts = products.map((product, index) => {
    const subProduct = product.subProducts?.[0];
    const imageUrl = subProduct?.images?.[0]?.url || "/placeholder.jpg";
    const originalPrice = subProduct?.sizes?.[0]?.price || 0;
    const discountedPrice =
      subProduct?.discount > 0
        ? (originalPrice - (originalPrice * subProduct.discount) / 100).toFixed(
            2
          )
        : originalPrice;

    return (
      <Link key={index} href={`/product/${product.slug}?style=0`}>
        <div className="space-y-2 min-w-[110px] flex-shrink-0 sm:min-w-0">
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name || "Product image"}
              fill
              className="object-cover"
              sizes="200px"
              quality={80}
            />
            {subProduct?.discount > 0 && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                {subProduct.discount}% OFF
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm truncate">{product.name}</h4>
            <div className="flex items-baseline gap-2">
              <span className="font-bold">${discountedPrice}</span>
              {subProduct?.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <Dialog open={true} onOpenChange={(open) => setOpen(open)}>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-6 p-4 sm:p-6 bg-background rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Input */}
          <Input
            type="search"
            placeholder="Search..."
            className="w-full mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Trending */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Button
                  onClick={() => setQuery(search)}
                  key={search}
                  variant="outline"
                  size="sm"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {query.length > 0 ? "Search Results" : "Recommended for you"}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader className="animate-spin" size={40} />
              </div>
            ) : (
              <div className="flex space-x-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:space-x-0 sm:gap-2">
                {displayProducts}
              </div>
            )}

            {query.length > 0 && !loading && products.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                No results found for "{query}".
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;
