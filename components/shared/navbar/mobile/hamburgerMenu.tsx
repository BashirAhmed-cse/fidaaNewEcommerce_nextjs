"use client";
import { useAtom, useStore } from "jotai";
import React from "react";
import { hamburgerMenuState } from "../store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, Package, Truck, User } from "lucide-react";
import Link from "next/link";

const MobileHamBurgerMenu = ({
  navItems,
}: {
  navItems: { name: string; href?: string; _id?: string; slug?: string }[];
}) => {
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState, {
    store: useStore(),
  });

  const handleOnClickHamurgerMenu = () => {
    setHamMenuOpen(!hamMenuOpen);
  };

  return (
    <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={handleOnClickHamurgerMenu}
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto"
      >
        <div className="flex items-center space-x-4 mb-2">
          <User size={40} className="border-2 border-black p-1 rounded-full" />
          <div>
            <p className="text-sm font-medium">Download our app</p>
            <p className="text-sm text-muted-foreground">and get 10% OFF!</p>
          </div>
        </div>
        <Button className="w-full mb-2 bg-red-500 hover:bg-red-600 text-white rounded-none">
          Download App
        </Button>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none"
          >
            <Package size={20} />
            <span>MY ORDERS</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none"
          >
            <Truck size={20} />
            <span>TRACK ORDER</span>
          </Button>
        </div>
        <div className="space-y-4">
          {/* Shop All link */}
          <Link href="/shop" onClick={() => setHamMenuOpen(false)}>
            <div className="flex items-center justify-between py-2 border-b border-b-gray-300">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Shop All</span>
              </div>
            </div>
          </Link>
          
          {/* Categories section */}
          {/* Categories section */}
<div className="border-b border-b-gray-300 pb-2">
  <div className="flex items-center justify-between py-2">
    <span className="font-semibold text-sm text-gray-800 uppercase tracking-wide">Categories</span>
  </div>
  <div className="pl-2 space-y-2">
    {navItems.map((item) => (
      <Link 
        key={item._id || item.name} 
        href={item.slug ? `/shop?category=${item.slug}` : item.href || "#"}
        onClick={() => setHamMenuOpen(false)}
        className="block group"
      >
        <div className="flex items-center space-x-2 px-2 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition duration-150">
          <ChevronRight size={16} className="text-gray-400 group-hover:text-black" />
          <span>{item.name}</span>
        </div>
      </Link>
    ))}
  </div>
</div>

        </div>
        <div className="mt-6 bg-green-500 p-4 rounded-lg">
          <p className="text-white font-bold">NEW LAUNCH ALERT!</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileHamBurgerMenu;