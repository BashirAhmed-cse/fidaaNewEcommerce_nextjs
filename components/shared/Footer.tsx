import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-white py-12 px-6">
      {/* Main container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wide">fidaa</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Unit 13, North Orbital Commercial Park, Napsbury Lane,
            St Albans, UK
          </p>
          <a
            href="mailto:info@fidaa.co.uk"
            className="block text-sm text-gray-400 hover:text-white transition"
          >
            info@fidaa.co.uk
          </a>
          <a
            href="tel:07403384309"
            className="block text-sm text-gray-400 hover:text-white transition"
          >
            07403384309
          </a>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-500 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <Youtube size={20} />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">SHOP</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                Sale
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-lg font-semibold mb-4">HELP</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                Customer Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300 transition">
                Legal & Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© 2025 fidaa. All rights reserved.</p>
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
