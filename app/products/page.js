// app/products/page.jsx — Server Component
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ProductsClient from "@/components/ProductsClient";

export const revalidate = 60;

export default async function ProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <div className="min-h-screen bg-[#FFF8F8]" dir="rtl">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-rose-400 via-pink-500 to-pink-600 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 rounded-full bg-white/5 blur-sm" />

        <div className="relative max-w-7xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-pink-200 text-sm mb-5 flex-wrap">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HiHome className="w-3.5 h-3.5" /> الرئيسية
            </Link>
            <HiArrowLeft className="w-3 h-3 opacity-50 rotate-180" />
            <span className="text-white font-bold">كل المنتجات</span>
          </nav>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-sm">
            كل المنتجات
          </h1>
          <p className="text-pink-100 text-lg font-light max-w-md">
            اختار من تشكيلتنا الكاملة — فيه حاجة لكل ذوق
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <FiShoppingBag className="w-4 h-4" />
              {products?.length || 0} منتج
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <GiDonut className="w-4 h-4" />
              {categories?.length || 0} قسم
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="-mt-1">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40V20C360 0 720 40 1080 20C1260 10 1380 25 1440 20V40H0Z"
            fill="#FFF8F8"
          />
        </svg>
      </div>

      {/* ── Client: Filter + Grid ── */}
      <ProductsClient products={products || []} categories={categories || []} />
    </div>
  );
}
