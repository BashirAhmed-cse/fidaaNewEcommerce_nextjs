"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAtom, useStore } from "jotai";
import { cartMenuState } from "./store";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  saveCartForUser,
  updateCartForUser,
} from "@/lib/database/actions/cart.actions";
import { FaArrowCircleRight } from "react-icons/fa";
import { handleError } from "@/lib/utils";
import Link from "next/link";
import CartSheetItems from "../cart/CartSheetItems";

// TypeScript interface for cart items
interface CartItem {
  _uid: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

const CartDrawer = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const cart = useCartStore((state: any) => state.cart.cartItems) as CartItem[];
  const [loading, setLoading] = useState(false);

  // Rehydrate cart store on mount
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Update cart in the database when cart changes
  useEffect(() => {
    const update = async () => {
      if (cart.length > 0) {
        try {
          const res = await updateCartForUser(cart);
          if (!res?.success) {
            console.error("Failed to update cart:", res?.message);
          }
        } catch (error) {
          handleError(error);
        }
      }
    };
    update();
  }, [cart]);

  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
  };

  const total = cart
    .reduce((sum: number, item: CartItem) => sum + item.price * item.qty, 0)
    .toFixed(2);

  const saveCartToDbHandler = async () => {
    if (userId) {
      setLoading(true);
      try {
        const res = await saveCartForUser(cart, userId);
        if (res?.success) {
          router.replace("/checkout");
        } else {
          throw new Error(res?.message || "Failed to save cart");
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/sign-in?next=checkout");
    }
  };

  return (
    <div className="relative">
      <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={handleOnClickCartMenu}
            variant={"ghost"}
            size={"icon"}
            className="relative"
          >
            <ShoppingBag size={24} className="text-main" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-main rounded-full">
              {cart.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading text-main">CART</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex justify-center h-[80vh] items-center">
                <div className="">
                  <h1 className="text-2xl mb-[10px] text-center flex items-center justify-center font-bold">
                    Your Cart is empty
                  </h1>
                  <Link href={"/shop"}>
                    <Button className="flex justify-center items-center w-full gap-[10px]">
                      Shop Now
                      <FaArrowCircleRight />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              cart.map((product: CartItem) => (
                <CartSheetItems product={product} key={product._uid} />
              ))
            )}
          </div>
          <div className="absolute bottom-2 w-[90%] mt-6 bg-white">
            <p className="text-sm text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <Button
              onClick={saveCartToDbHandler}
              disabled={cart.length === 0 || loading}
              className="w-full mt-4 bg-black text-white hover:bg-gray-800 gap-[10px]"
            >
              {loading
                ? "Loading..."
                : `Continue to Secure Checkout - £${total}`}
              <FaArrowCircleRight />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;