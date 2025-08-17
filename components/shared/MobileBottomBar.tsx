"use client";

import { useStore, useAtom } from "jotai";
import { Grid, Home, Menu, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import {
  hamburgerMenuState,
  cartMenuState,
  accountMenuState,
} from "./navbar/store";

const MobileBottomBar = () => {
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState, {
    store: useStore(),
  });
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuState, {
    store: useStore(),
  });

  const handleOnClickHamburgerMenu = () => {
    setHamMenuOpen(true);
  };
  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
  };
  const handleOnClickAccountMenu = () => {
    setAccountMenuOpen(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-black focus:text-black focus:outline-none"
          aria-label="Home"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <button
          onClick={handleOnClickHamburgerMenu}
          className="flex flex-col items-center text-gray-600 hover:text-black focus:text-black focus:outline-none"
          aria-label="Open menu"
          type="button"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>

        <Link
          href="/shop"
          className="flex flex-col items-center text-gray-600 hover:text-black focus:text-black focus:outline-none"
          aria-label="Shop"
        >
          <Grid className="w-6 h-6" />
          <span className="text-xs mt-1">Shop</span>
        </Link>

        <button
          onClick={handleOnClickCartMenu}
          className="flex flex-col items-center text-gray-600 hover:text-black focus:text-black focus:outline-none"
          aria-label="Open cart"
          type="button"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">Cart</span>
        </button>

        <button
          onClick={handleOnClickAccountMenu}
          className="flex flex-col items-center text-gray-600 hover:text-black focus:text-black focus:outline-none"
          aria-label="Open account menu"
          type="button"
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Account</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomBar;
