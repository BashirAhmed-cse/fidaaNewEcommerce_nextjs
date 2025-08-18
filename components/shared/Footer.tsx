import React from "react";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      {/* Main container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="space-y-4">
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
          <p className="text-sm text-gray-300 leading-relaxed">
            Unit 13, North Orbital Commercial Park, Napsbury Lane,
            St Albans, UK
          </p>
          <a
            href="mailto:info@fidaa.co.uk"
            className="block text-sm text-gray-400 hover:text-main transition-colors"
          >
            info@fidaa.co.uk
          </a>
          <a
            href="tel:07403384309"
            className="block text-sm text-gray-400 hover:text-main transition-colors"
          >
            07403384309
          </a>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-main transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-main transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            
           
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Contact Us', 'Careers', 'Sustainability'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-main transition-colors block py-1"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">SHOP</h3>
          <ul className="space-y-2 text-sm">
            {['New Arrivals', 'Best Sellers', 'Sale', 'Gift Cards'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-main transition-colors block py-1"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">HELP</h3>
          <ul className="space-y-2 text-sm">
            {['Customer Service', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Legal & Privacy'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-main transition-colors block py-1"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} fidaa. All rights reserved.</p>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <span>
            Language: <strong className="text-white">English</strong>
          </span>
          <span>
            Currency: <strong className="text-white">GBP</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;