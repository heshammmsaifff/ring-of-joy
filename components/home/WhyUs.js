import { GiDonut } from "react-icons/gi";
import { MdDeliveryDining, MdVerified, MdFavorite } from "react-icons/md";
import { FiClock, FiStar, FiAward } from "react-icons/fi";

const FEATURES = [
  {
    icon: <MdDeliveryDining className="w-7 h-7" />,
    color: "from-pink-400 to-rose-500",
    shadow: "shadow-pink-200",
    title: "توصيل في 30 دقيقة",
    desc: "بنوصلك طازج على بابك بسرعة البرق — مش هتستنى أكتر من نص ساعة",
  },
  {
    icon: <GiDonut className="w-7 h-7" />,
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-200",
    title: "طازة كل يوم",
    desc: "كل يوم الصبح بنعمل دوناتس جديدة من الصفر",
  },
  {
    icon: <FiAward className="w-7 h-7" />,
    color: "from-violet-400 to-purple-500",
    shadow: "shadow-purple-200",
    title: "أجود المكونات",
    desc: "بنستخدم زبدة طبيعية وشوكولاتة بلجيكي وكريمة حقيقية",
  },
  {
    icon: <FiStar className="w-7 h-7" />,
    color: "from-teal-400 to-emerald-500",
    shadow: "shadow-teal-200",
    title: "+50 نكهة مختلفة",
    desc: "عندنا نكهة لكل ذوق وكل مزاج",
  },
  {
    icon: <MdFavorite className="w-7 h-7" />,
    color: "from-pink-500 to-pink-600",
    shadow: "shadow-pink-200",
    title: "12,000+ عميل سعيد",
    desc: "عيلتنا كبرت — وكل يوم بيزيد ناس جديدة بتحب Ring Of Joy",
  },
  {
    icon: <FiClock className="w-7 h-7" />,
    color: "from-blue-400 to-indigo-500",
    shadow: "shadow-blue-200",
    title: "متاح 7 أيام",
    desc: "من الصبح لآخر الليل — وقتك هو وقتنا",
  },
];

const STATS = [
  { num: "+50", label: "نكهة دوناتس" },
  { num: "12K+", label: "عميل سعيد" },
  { num: "30m", label: "متوسط التوصيل" },
  { num: "4.9★", label: "متوسط التقييم" },
];

export default function WhyUsSection() {
  return (
    <section dir="rtl" className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-pink-400 mb-3 flex items-center justify-center gap-2">
            <MdVerified className="w-4 h-4" />
            ليه تختارنا
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Ring of
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-pink-500 to-rose-400">
              {" "}
              Joy
            </span>
          </h2>
          <p className="text-gray-700  mt-4 text-lg max-w-xl mx-auto">
            الدوناتس عندنا مش تحلية.. دي طبطبة على القلب في هيئة عجينة
          </p>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="group relative bg-gray-50 hover:bg-white rounded-3xl p-6 border border-transparent hover:border-pink-100 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Decorative glow */}
              <div
                className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} ${feat.shadow} shadow-lg flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {feat.icon}
              </div>

              <h3 className="font-black text-gray-800 text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Stats Banner ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-pink-500 via-rose-500 to-pink-600 p-10 text-white">
          {/* Decorative donuts */}
          <div className="absolute -top-6 -right-6 opacity-10">
            <GiDonut className="w-32 h-32 text-white" />
          </div>
          <div className="absolute -bottom-8 -left-4 opacity-10">
            <GiDonut className="w-40 h-40 text-white" />
          </div>
          <div className="absolute top-4 left-1/3 opacity-5">
            <GiDonut className="w-20 h-20 text-white" />
          </div>

          <div className="relative z-10">
            <p className="text-center text-pink-100 font-bold text-sm tracking-widest uppercase mb-8">
              More Donuts, More Family
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-black leading-none mb-2">
                    {s.num}
                  </p>
                  <p className="text-pink-200 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
