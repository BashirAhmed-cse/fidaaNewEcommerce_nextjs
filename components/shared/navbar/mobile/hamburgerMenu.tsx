"use client";
import { useAtom, useStore } from "jotai";
import React from "react";
import { hamburgerMenuState } from "../store";
import { Sheet, SheetContent, SheetTrigger, SheetTitle  } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, Package, Truck, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";

const MobileHamBurgerMenu = ({
  navItems,
}: {
  navItems: { name: string; href?: string; _id?: string; slug?: string }[];
}) => {
  const store = useStore();
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState, { store });

  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setHamMenuOpen(true)}
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto"
      >
        <VisuallyHidden>
    <SheetTitle>Mobile Menu</SheetTitle>
  </VisuallyHidden>
        {/* User Section */}
        <div className="flex items-center space-x-4 mb-4">
          <User size={40} className="border-2 border-black p-1 rounded-full" />
          {isSignedIn ? (
            <div>
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          ) : (
            <p className="text-sm font-medium">Welcome Guest</p>
          )}
        </div>

        {/* Quick Actions */}
        {isSignedIn && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link href="/profile" onClick={() => setHamMenuOpen(false)}>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none w-full"
              >
                <Package size={20} />
                <span>MY ORDERS</span>
              </Button>
            </Link>
            <Link href="/track-order" onClick={() => setHamMenuOpen(false)}>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none w-full"
              >
                <Truck size={20} />
                <span>TRACK ORDER</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Nav Links */}
        <div className="space-y-4">
          <Link href="/shop" onClick={() => setHamMenuOpen(false)}>
            <div className="flex items-center justify-between py-2 border-b border-b-gray-300">
              <span className="font-medium">Shop All</span>
            </div>
          </Link>

          {/* Categories */}
          <div className="border-b border-b-gray-300 pb-2">
            <div className="flex items-center justify-between py-2">
              <span className="font-semibold text-sm text-gray-800 uppercase tracking-wide">
                Categories
              </span>
            </div>
            <div className="pl-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item._id || item.name}
                  href={
                    item.slug ? `/shop?category=${item.slug}` : item.href || "#"
                  }
                  onClick={() => setHamMenuOpen(false)}
                  className="block group"
                >
                  <div className="flex items-center space-x-2 px-2 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition duration-150">
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-black"
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="mt-6 space-y-2">
          {isSignedIn ? (
            <>
              <Link href="/profile" onClick={() => setHamMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full flex items-center space-x-2 text-red-500 hover:text-red-600"
                onClick={() => {
                  setHamMenuOpen(false);
                  signOut({ redirectUrl: "/sign-in" });
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setHamMenuOpen(false)}>
                <Button className="w-full bg-black text-white">Sign In</Button>
              </Link>
              <Link href="/sign-up" onClick={() => setHamMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

       
      </SheetContent>
    </Sheet>
  );
};

export default MobileHamBurgerMenu;
