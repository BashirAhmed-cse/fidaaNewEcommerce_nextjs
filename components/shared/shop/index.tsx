"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAllCategories } from "@/lib/database/actions/categories.actions";
import { getAllSubCategoriesByParentId } from "@/lib/database/actions/subCategory.actions";
import { handleError } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ShopPageComponent = () => {
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res?.success) {
          setAllCategories(res.categories || []);
          setSelectedCategoryId(res?.categories[0]?._id || "");
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories whenever category changes
  useEffect(() => {
    async function fetchSubCategories() {
      if (!selectedCategoryId) return;
      try {
        const res = await getAllSubCategoriesByParentId(selectedCategoryId);
        setSubCategories(res?.subCategories || []);
      } catch (err) {
        toast.error("Failed to load subcategories");
        console.error(err);
      }
    }
    fetchSubCategories();
  }, [selectedCategoryId]);

  // Log subcategories whenever they change (for debugging only)
  useEffect(() => {
    console.log("Subcategories updated:", subCategories);
  }, [subCategories]);

  return (
    <div className="container my-[50px]">
      <h1 className="heading mb-8 text-center">Shop All Products</h1>

      {/* Category filter */}
      <RadioGroup
        value={selectedCategoryId}
        onValueChange={setSelectedCategoryId}
      >
        <div className="flex flex-row justify-center items-center gap-[10px] flex-wrap">
          {allCategories.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <RadioGroupItem value={category._id} id={category._id} />
              <Label htmlFor={category._id}>{category.name}</Label>
            </div>
          ))}
        </div>

        {/* Subcategories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {subCategories.length > 0 ? (
            subCategories.map((item) => (
              <div
                key={item._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Link href={`/shop/subCategory/${item._id}?name=${item.name}`}>
                  <Image
                    src={item.images[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    width={450}
                    height={320}
                    className="rounded-md object-cover"
                  />
                </Link>
                <div className="mt-3 font-semibold">{item.name}</div>
                <Link href={`/shop/subCategory/${item._id}?name=${item.name}`}>
                  <Button className="mt-3 w-full">See All Products</Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No subcategories found.
            </p>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ShopPageComponent;
