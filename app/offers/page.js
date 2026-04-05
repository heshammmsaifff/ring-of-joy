// app/offers/page.jsx — Server Component
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { FiPercent } from "react-icons/fi";
import { HiHome, HiArrowLeft } from "react-icons/hi";
import { MdDeliveryDining, MdLocalOffer } from "react-icons/md";
import OfferCard from "@/components/OfferCard";

export const revalidate = 60;

export default async function AllOffersPage() {
  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const maxDiscount = offers?.length
    ? Math.max(
        ...offers.map((o) =>
          o.original_price > 0
            ? Math.round(
                ((o.original_price - o.final_price) / o.original_price) * 100,
              )
            : 0,
        ),
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#FFF5F7]" dir="rtl">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-rose-400 via-pink-500 to-pink-600 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 rounded-full bg-white/5 blur-sm" />
        {/* Floating donuts */}
        <div
          className="absolute top-8 left-16 opacity-10"
          style={{ animation: "floatY 6s ease-in-out infinite" }}
        >
          <GiDonut className="w-20 h-20 text-white" />
        </div>
        <div
          className="absolute bottom-6 right-24 opacity-10"
          style={{
            animation: "floatY 8s ease-in-out infinite",
            animationDelay: "1s",
          }}
        >
          <GiDonut className="w-14 h-14 text-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-pink-200 text-sm mb-5 flex-wrap">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HiHome className="w-3.5 h-3.5" /> الرئيسية
            </Link>
            <HiArrowLeft className="w-3 h-3 opacity-50 rotate-180" />
            <span className="text-white font-bold">العروض</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-bold mb-5">
            <MdLocalOffer className="w-4 h-4" /> عروض حصرية
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-sm">
            أحسن العروض
          </h1>
          <p className="text-pink-100 text-lg font-light max-w-md">
            اوعى تفوّت — عروض بتتجدد كل يوم وكميات محدودة!
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <MdLocalOffer className="w-4 h-4" />
              {offers?.length || 0} عرض متاح
            </div>
            {maxDiscount > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
                <FiPercent className="w-4 h-4" />
                خصومات لحد {maxDiscount}%
              </div>
            )}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <MdDeliveryDining className="w-4 h-4" />
              توصيل سريع
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
            fill="#FFF5F7"
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        {/* Empty */}
        {(!offers || offers.length === 0) && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <GiDonut className="w-12 h-12 text-pink-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-600 mb-2">
              مفيش عروض دلوقتي
            </h3>
            <p className="text-gray-400 mb-8">
              ارجع تاني قريباً — هيبقى فيه عروض جديدة!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-7 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
            >
              <GiDonut className="w-4 h-4" /> تصفح المنتجات
            </Link>
          </div>
        )}

        {/* Grid */}
        {offers && offers.length > 0 && (
          <>
            <p className="text-sm text-gray-400 font-medium mb-6">
              عرض{" "}
              <span className="font-black text-gray-700">{offers.length}</span>{" "}
              عرض
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offers.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
