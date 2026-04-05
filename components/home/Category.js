import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";

export default async function CategoriesSection() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (!categories || categories.length === 0) return null;

  return (
    <section dir="rtl" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            {/* Label */}
            <p className="text-xs font-black tracking-[0.25em] uppercase text-pink-400 mb-2 flex items-center gap-2">
              <GiDonut className="w-3.5 h-3.5" />
              تصفح حسب ذوقك
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              اختار القسم
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-pink-500 to-rose-400">
                {" "}
                اللي يعجبك
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-pink-500 hover:text-pink-700 font-bold text-sm transition-colors group"
          >
            عرض الكل
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Categories Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group relative overflow-hidden rounded-3xl aspect-square bg-pink-50 shadow-sm hover:shadow-xl hover:shadow-pink-100/80 hover:-translate-y-2 transition-all duration-400"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <GiDonut className="w-16 h-16 text-pink-200" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent" />

              {/* Name */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className="text-white font-black text-base leading-tight drop-shadow">
                  {cat.name}
                </h3>
                <p className="text-pink-200 text-xs font-medium mt-0.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                  اضغط للتصفح <HiArrowLeft className="w-3 h-3" />
                </p>
              </div>

              {/* Hover ring */}
              <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 group-hover:ring-pink-400/60 transition-all duration-300" />
            </Link>
          ))}

          {/* "See all" card */}
          <Link
            href="/products"
            className="group relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm hover:shadow-xl hover:shadow-pink-200/80 hover:-translate-y-2 transition-all duration-400 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GiDonut className="w-7 h-7 text-white" />
            </div>
            <div className="text-center px-3">
              <p className="text-white font-black text-sm">عرض الكل</p>
              <p className="text-pink-200 text-xs mt-0.5">كل الأنواع هنا</p>
            </div>
            <HiArrowLeft className="w-4 h-4 text-white/70 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile "see all" link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-pink-500 font-bold text-sm hover:text-pink-700 transition-colors"
          >
            عرض جميع المنتجات <HiArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
