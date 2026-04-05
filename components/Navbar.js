"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import CartSlider from "@/components/CartSlider";
import {
  FiSearch,
  FiShoppingBag,
  FiChevronDown,
  FiX,
  FiMenu,
} from "react-icons/fi";

import { FaCartArrowDown } from "react-icons/fa";

import { HiHome, HiPhone } from "react-icons/hi";
import { HiFire } from "react-icons/hi2";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 150);
  };

  return (
    <>
      {/* ── Cart Slider ── */}
      <CartSlider />

      {/* ── Main Navbar ── */}
      <nav
        dir="rtl"
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-pink-100/60"
            : "bg-white/80 backdrop-blur-md"
        } border-b border-pink-100`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="relative h-20 w-36 group-hover:opacity-90 transition-opacity duration-300">
                <Image
                  src="/logo.jpg"
                  alt="Royal Donuts"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/">
                <HiHome className="w-4 h-4" />
                الرئيسية
              </NavLink>

              {/* Dropdown */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold text-sm transition-all duration-200">
                  المنتجات
                  <FiChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-pink-500" : ""}`}
                  />
                </button>
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-pink-100/80 border border-pink-50 overflow-hidden transition-all duration-300 origin-top-right ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 bg-gradient-to-l from-pink-50 to-rose-50 border-b border-pink-100">
                    <p className="text-xs font-bold text-pink-500 tracking-widest uppercase">
                      تصفح الأقسام
                    </p>
                  </div>
                  <div className="py-2 max-h-72 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150 group/item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-pink-100 shadow-sm group-hover/item:scale-105 transition-transform duration-200">
                          <img
                            src={cat.image_url}
                            className="w-full h-full object-cover"
                            alt={cat.name}
                          />
                        </div>
                        <span className="font-medium">{cat.name}</span>
                        <FiChevronDown className="w-3.5 h-3.5 text-pink-300 mr-auto opacity-0 group-hover/item:opacity-100 transition-opacity rotate-90" />
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-pink-50 bg-gray-50/50">
                    <Link
                      href="/products"
                      className="text-xs text-pink-500 font-bold hover:text-pink-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      عرض جميع المنتجات ←
                    </Link>
                  </div>
                </div>
              </div>

              <NavLink href="/offers">
                <HiFire className="w-4 h-4 text-orange-500" />
                العروض
              </NavLink>
              <NavLink href="/contact">
                <HiPhone className="w-4 h-4" />
                تواصل معنا
              </NavLink>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button className="p-2.5 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200">
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
              >
                <FaCartArrowDown className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce-once">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                href="/products"
                className="relative overflow-hidden bg-gradient-to-l from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 group/btn flex items-center gap-2"
              >
                <span className="relative z-10">اطلب الآن</span>
                <span className="absolute inset-0 bg-gradient-to-l from-rose-500 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-xl text-gray-600 hover:bg-pink-50"
              >
                <FiShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-pink-50 transition-colors"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white border-t border-pink-50 px-4 pt-4 pb-6 space-y-1">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <HiHome className="w-4 h-4" /> الرئيسية
            </MobileNavLink>
            <MobileNavLink
              href="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiFire className="w-4 h-4 text-orange-500" /> العروض
            </MobileNavLink>
            <div className="pt-2 pb-1">
              <p className="text-[11px] font-bold text-pink-400 tracking-widest uppercase mb-3 px-1">
                الأقسام
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 bg-pink-50/70 hover:bg-pink-100 rounded-xl text-sm text-gray-700 font-medium transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-pink-100">
                      <img
                        src={cat.image_url}
                        className="w-full h-full object-cover"
                        alt={cat.name}
                      />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <MobileNavLink
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiPhone className="w-4 h-4" /> تواصل معنا
            </MobileNavLink>
            <div className="pt-3">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-gradient-to-l from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
              >
                اطلب الآن
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold text-sm transition-all duration-200"
    >
      {children}
    </Link>
  );
}
function MobileNavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-3.5 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold text-sm transition-colors duration-150"
    >
      {children}
    </Link>
  );
}
