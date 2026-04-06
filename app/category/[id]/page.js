// ✅ Server Component — بيجيب البيانات من Supabase
// export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { HiArrowLeft, HiHome } from "react-icons/hi";
import { FiPercent, FiShoppingBag } from "react-icons/fi";
import { MdGridView } from "react-icons/md";
import ProductCard from "@/components/ProductCard"; // ✅ Client Component منفصل

export default async function CategoryPage({ params }) {
  const { id } = await params;

  const [{ data: products }, { data: category }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("category_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("id", id).single(),
  ]);

  return (
    <div className="min-h-screen bg-[#FFF8F8]" dir="rtl">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-rose-400 via-pink-500 to-pink-600 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 rounded-full bg-white/5 blur-sm" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-right">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-pink-200 text-sm mb-5 justify-center md:justify-start flex-wrap">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <HiHome className="w-3.5 h-3.5" /> الرئيسية
              </Link>
              <HiArrowLeft className="w-3 h-3 opacity-50 rotate-180" />
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                المنتجات
              </Link>
              <HiArrowLeft className="w-3 h-3 opacity-50 rotate-180" />
              <span className="text-white font-bold">{category?.name}</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-sm">
              {category?.name}
            </h1>
            <p className="text-pink-100 text-lg font-light max-w-md">
              اختار من أحسن التشكيلة — كل حاجة في القسم ده بتتميز بجودتها
            </p>

            {/* Pills */}
            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start flex-wrap">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
                <FiShoppingBag className="w-4 h-4" />
                {products?.length || 0} منتج متاح
              </div>
              {products && products.some((p) => p.discount_value > 0) && (
                <div className="inline-flex items-center gap-2 bg-rose-500 rounded-full px-4 py-2 text-sm font-bold animate-pulse">
                  <FiPercent className="w-4 h-4" /> فيه عروض دلوقتي
                </div>
              )}
            </div>
          </div>

          {/* Category Image */}
          {category?.image_url && (
            <div className="flex-shrink-0">
              <div
                className="w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-white/25 shadow-2xl shadow-pink-900/30"
                style={{ animation: "floatY 5s ease-in-out infinite" }}
              >
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
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

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        {products && products.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
              <MdGridView className="w-4 h-4 text-pink-400" />
              عرض{" "}
              <span className="font-black text-gray-700">
                {products.length}
              </span>{" "}
              منتج
            </p>
          </div>
        )}

        {/* Empty */}
        {(!products || products.length === 0) && (
          <div className="text-center py-28">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <GiDonut className="w-12 h-12 text-pink-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-700 mb-2">
              مفيش منتجات في القسم ده دلوقتي
            </h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              قريباً هيتضاف منتجات جديدة — ارجع تاني قريب!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-pink-500 text-white px-7 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
              >
                <HiHome className="w-4 h-4" /> الرئيسية
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-pink-600 border-2 border-pink-200 px-7 py-3 rounded-2xl font-bold hover:bg-pink-50 transition-colors"
              >
                تصفح كل المنتجات
              </Link>
            </div>
          </div>
        )}

        {/* ✅ Grid — بيستخدم ProductCard Client Component */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50%       { transform: translateY(-10px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
