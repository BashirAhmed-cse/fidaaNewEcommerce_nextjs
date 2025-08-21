"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shared/home/ProductCard";
import { ChevronDown } from "lucide-react";
import { getAllProducts } from "@/lib/database/actions/product.actions";
import { Slider } from "@/components/ui/slider";

// Interface for raw product data from getAllProducts
interface RawSubProduct {
  price?: number;
  originalPrice?: number;
  discount?: number;
  isSale?: boolean;
  images?: Array<{ url: string }>;
  sizes?: Array<{ price: number }>;
}

interface RawProduct {
  _id: string;
  name: string;
  category?: { _id: string; name: string };
  subProducts: RawSubProduct[];
  rating: number;
  numReviews: number;
  featured: boolean;
  slug: string;
}

interface ProductType {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  isBestseller: boolean;
  isSale: boolean;
  slug: string;
  prices: number[];
}

interface Category {
  id: string;
  name: string;
}

const ShopPage = () => {
  const [sortBy, setSortBy] = useState<string>("Featured");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const searchParams = useSearchParams();
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllProducts();
        const fetched: RawProduct[] = response?.products || [];

        const transformed: ProductType[] = fetched.map((product: RawProduct) => {
          const basePrice = product.subProducts[0]?.price ?? 0;
          const sizes =
            product.subProducts[0]?.sizes
              ?.map((s) => s.price)
              .filter((price): price is number => typeof price === "number") ?? [];
          const allPrices = sizes.length > 0 ? sizes : [basePrice];

          return {
            id: product._id,
            name: product.name,
            category: product.category?.name ?? "Unknown",
            categoryId: product.category?._id ?? "uncategorized",
            image: product.subProducts[0]?.images?.[0]?.url ?? "",
            rating: product.rating,
            reviews: product.numReviews,
            price: basePrice,
            originalPrice: product.subProducts[0]?.originalPrice ?? basePrice,
            discount: product.subProducts[0]?.discount ?? 0,
            isBestseller: product.featured,
            isSale: product.subProducts[0]?.isSale ?? false,
            slug: product.slug,
            prices: [...allPrices].sort((a, b) => a - b),
          };
        });

        // Explicitly type the flatMap parameter
        const allPrices: number[] = transformed.flatMap((p: ProductType) => p.prices);
        const computedMax: number =
          allPrices.length > 0 ? Math.max(...allPrices) : 5000;

        setProducts(transformed);
        setPriceRange([0, computedMax]);
        setMaxPrice(computedMax);

        // Handle category query param
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          const requestedCategories = categoryParam
            .split(",")
            .map((c) => c.toLowerCase());

          const matched = transformed
            .filter((p) => requestedCategories.includes(p.category.toLowerCase()))
            .map((p) => p.categoryId);

          if (matched.length) setSelectedCategories(matched);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const categories = useMemo<Category[]>(
    () =>
      Array.from(
        new Map(
          products.map((p) => [
            p.categoryId,
            { id: p.categoryId, name: p.category },
          ])
        ).values()
      ),
    [products]
  );

  const debouncedSetPriceRange = useMemo(
    () =>
      debounce((val: [number, number]) => {
        setPriceRange(val);
        setCurrentPage(1);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetPriceRange.cancel();
    };
  }, [debouncedSetPriceRange]);

  const { filteredProducts, totalPages, currentProducts } = useMemo(() => {
    let result = [...products];

    result = result.filter((product) =>
      product.prices.some(
        (price) => price >= priceRange[0] && price <= priceRange[1]
      )
    );

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === "Price: Low to High")
        return Math.min(...a.prices) - Math.min(...b.prices);
      if (sortBy === "Price: High to Low")
        return Math.max(...b.prices) - Math.max(...a.prices);
      if (sortBy === "Customer Rating") return b.rating - a.rating;
      if (sortBy === "Featured")
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return 0;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const paginated = sorted.slice(indexOfFirstProduct, indexOfLastProduct);
    const total = Math.max(1, Math.ceil(sorted.length / productsPerPage));

    return {
      filteredProducts: sorted,
      totalPages: total,
      currentProducts: paginated,
    };
  }, [products, priceRange, selectedCategories, sortBy, currentPage]);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortBy("Featured");
    setCurrentPage(1);
    setIsFilterOpen(false);
  }, [maxPrice]);

  const applyFilters = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setIsFilterOpen(false);
      setLoading(false);
    }, 300);
  }, []);

  const activeFilterCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={debouncedSetPriceRange}
                  aria-label="Price range filter"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
                        aria-label={`Filter by ${category.name}`}
                      />
                      <label
                        htmlFor={`cat-${category.id}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-md"
                aria-label="Open filters"
              >
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-white text-gray-900 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="relative">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2 hidden sm:inline">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    aria-label="Sort products"
                  >
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Customer Rating</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            {isFilterOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close filter drawer"
                />
                <div className="absolute left-0 top-0 h-full w-4/5 bg-white p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close filters"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Price Range
                    </h3>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      onValueCommit={debouncedSetPriceRange}
                      aria-label="Price range filter"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Categories
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mob-cat-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
                            aria-label={`Filter by ${category.name}`}
                          />
                          <label
                            htmlFor={`mob-cat-${category.id}`}
                            className="ml-3 text-sm text-gray-700"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={applyFilters}
                    className="w-full bg-gray-900 text-white py-2 rounded-md mt-4"
                    aria-label="Apply filters"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            {error ? (
              <div className="text-center py-12" aria-live="polite">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
                <button
                  onClick={() => fetchProducts()}
                  className="text-sm text-gray-900 underline hover:text-gray-700"
                  aria-label="Retry loading products"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                aria-live="polite"
              >
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
                    aria-label="Loading product"
                  >
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12" aria-live="polite">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-900 underline hover:text-gray-700"
                  aria-label="Clear all filters"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <ProductCard heading="" shop={true} products={currentProducts} />
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav
                      className="flex items-center space-x-2"
                      role="navigation"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Previous page"
                      >
                        ← Prev
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) pageNum = i + 1;
                          else if (currentPage <= 3) pageNum = i + 1;
                          else if (currentPage >= totalPages - 2)
                            pageNum = totalPages - 4 + i;
                          else pageNum = currentPage - 2 + i;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                currentPage === pageNum
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              aria-label={`Page ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Next page"
                      >
                        Next →
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;