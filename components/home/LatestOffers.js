// ✅ Server Component — بيجيب العروض من Supabase
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { MdLocalOffer } from "react-icons/md";
import OfferCard from "@/components/OfferCard"; // ✅ Client Component منفصل

export const revalidate = 60;

export default async function LatestOffersSection() {
  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (!offers || offers.length === 0) return null;

  return (
    <section dir="rtl" className="bg-[#FFF5F7] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-black tracking-[0.25em] uppercase text-pink-400 mb-2 flex items-center gap-2">
              <MdLocalOffer className="w-3.5 h-3.5" />
              عروض محدودة
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              أحدث
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-pink-500 to-rose-400">
                {" "}
                العروض 🔥
              </span>
            </h2>
            <p className="text-gray-400 mt-2 text-base font-light">
              اوعى تفوّت — الكميات محدودة!
            </p>
          </div>

          <Link
            href="/offers"
            className="hidden md:flex items-center gap-2 text-pink-500 hover:text-pink-700 font-bold text-sm transition-colors group"
          >
            عرض كل العروض
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ✅ Grid — بيستخدم OfferCard Client Component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-7 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
          >
            <MdLocalOffer className="w-4 h-4" /> عرض كل العروض
          </Link>
        </div>
      </div>
    </section>
  );
}
