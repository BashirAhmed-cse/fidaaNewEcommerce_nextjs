import Link from "next/link";
import { getAllCategories } from "@/lib/database/actions/categories.actions";
import CartDrawer from "./CartDrawer";
import NavbarInput from "./NavbarInput";
import AccountDropDown from "./AccountDropDown";
import MobileHamBurgerMenu from "./mobile/hamburgerMenu";

const Navbar = async () => {
  const { categories = [] } = (await getAllCategories()) || {};

  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          <div className="flex items-center lg:w-1/3">
            <MobileHamBurgerMenu navItems={[{ name: "Shop All", href: "/shop" }, ...categories]} />
            <NavbarInput responsive={false} />
          </div>

          <div className="flex-1 flex items-center justify-center lg:w-1/3">
            <Link href="/">
              <h1 className="text-2xl font-bold">fidaa</h1>
            </Link>
          </div>

          <div className="flex items-center justify-end lg:w-1/3">
            <AccountDropDown />
            <CartDrawer />
          </div>
        </div>

        <NavbarInput responsive={true} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start py-3 space-x-8">
            {/* Shop All link */}
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 group transition duration-300"
            >
              Shop All
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
            </Link>
            
            {/* Categories dropdown */}
           {/* Categories dropdown */}
<div className="relative group">
  <button className="text-sm font-medium text-gray-700 hover:text-black flex items-center transition duration-200">
    Categories
    <svg
      className="ml-1 h-4 w-4 transform transition-transform duration-200 group-hover:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {/* Dropdown menu */}
  <div className="absolute z-20 left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 ease-in-out">
    <ul className="py-2">
      {categories.map((cat: any) => (
        <li key={cat._id}>
          <Link
            href={`/shop?category=${cat.slug}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition duration-150"
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* Underline animation */}
  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
</div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation - Already handled by MobileHamBurgerMenu */}
    </nav>
  );
};

export default Navbar;