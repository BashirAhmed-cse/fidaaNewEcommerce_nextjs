"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useAtom, useStore } from "jotai";
import { quantityState } from "../jotai/store";

// Define TypeScript interface for product
interface Product {
  quantity: number;
  // Add other product properties as needed
}

interface QtyButtonsProps {
  product: Product;
  size: number;
  style: number;
}

const QtyButtons = ({ product, size, style }: QtyButtonsProps) => {
  const [qty, setQty] = useAtom(quantityState, {
    store: useStore(),
  });

  // Handle quantity reset and capping based on style and size changes
  useEffect(() => {
    // Reset quantity to 1 when style changes
    if (style) {
      setQty(1);
    }

    // Cap quantity at product.quantity when size changes or qty exceeds stock
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
  }, [style, size, qty, product.quantity, setQty]);

  return (
    <div>
      <div className="flex items-center gap-0">
        <Button
          onClick={() => qty > 1 && setQty((prev) => prev - 1)}
          variant={"outline"}
          className="bg-[#F2F2F2]"
          size={"icon"}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center border-y-2 py-[6px]">{qty}</span>
        <Button
          onClick={() => qty < product.quantity && setQty((prev) => prev + 1)}
          variant={"outline"}
          className="bg-[#F2F2F2]"
          size={"icon"}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div>
        {product.quantity < 1 && (
          <span className="text-red-500">Out of Stock</span>
        )}
      </div>
    </div>
  );
};

export default QtyButtons;