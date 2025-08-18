import Link from "next/link";
import { getAllCategories } from "@/lib/database/actions/categories.actions";
import CartDrawer from "./CartDrawer";
import NavbarInput from "./NavbarInput";
import AccountDropDown from "./AccountDropDown";
import MobileHamBurgerMenu from "./mobile/hamburgerMenu";
import Image from "next/image";

const Navbar = async () => {
  const { categories = [] } = (await getAllCategories()) || {};

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center  lg:w-1/3">
            <Link href="/" className="group">
              <div className="relative w-32 h-10"> {/* Adjust width/height as needed */}
                <Image
                  src="/logo.png"
                  alt="Fidaa Logo"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 768px) 100px, 150px"
                  priority
                />
              </div>
              {/* Optional underline animation */}
              <span className="block h-0.5 bg-transparent group-hover:bg-primary transition-all duration-300 w-0 group-hover:w-full mt-1"></span>
            </Link>
          </div>
          {/* Left Section - Mobile Menu & Search (desktop) */}
          <div className="flex items-center lg:w-1/3">
            <MobileHamBurgerMenu 
              navItems={[{ name: "Shop All", href: "/shop" }, ...categories]} 
            />
            <NavbarInput responsive={false} />
          </div>

   
          

          {/* Right Section - Account & Cart */}
          <div className="flex items-center justify-end lg:w-1/3 space-x-4">
            <AccountDropDown />
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Search */}
        <NavbarInput responsive={true} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-100 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-3 space-x-10">
            {/* Shop All link */}
            <Link
              href="/shop"
              className="relative text-sm font-medium text-main  transition duration-200 group"
            >
              Shop All
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* Categories dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-main  flex items-center transition duration-200 group">
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
                    d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Dropdown menu */}
              <div className="absolute z-20 left-1/2 transform -translate-x-1/2 mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 ease-in-out origin-top">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>
                <ul className="py-2">
                  {categories.map((cat: any) => (
                    <li key={cat._id}>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-main hover:bg-gray-50 hover:text-primary transition duration-150"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

           
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;