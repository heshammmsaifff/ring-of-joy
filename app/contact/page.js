// app/contact/page.jsx — Server Component
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { HiHome, HiArrowLeft, HiPhone } from "react-icons/hi";
import { FiMail, FiMapPin, FiClock, FiInstagram } from "react-icons/fi";
import { FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining, MdVerified } from "react-icons/md";

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3237.23541416473!2d31.791585951291342!3d30.725950581577337!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f825000831c131%3A0x59d66b313a1fb24e!2sRING%20OF%20JOY!5e0!3m2!1sen!2sus!4v1775485195208!5m2!1sen!2sus";
const CONTACT_CARDS = [
  {
    icon: <HiPhone className="w-6 h-6" />,
    color: "from-pink-400 to-rose-500",
    shadow: "shadow-pink-200",
    bg: "bg-pink-50",
    label: "اتصل بينا",
    value: "01055961002",
    sub: "متاحين من 8ص لـ 12م",
    href: "tel:+201055961002",
    cta: "اتصل دلوقتي",
  },
  {
    icon: <FaWhatsapp className="w-6 h-6" />,
    color: "from-green-400 to-emerald-500",
    shadow: "shadow-green-200",
    bg: "bg-green-50",
    label: "واتساب",
    value: "01055961002",
    sub: "رد سريع في دقايق",
    href: "https://wa.me/201055961002",
    cta: "ابعت رسالة",
  },
  {
    icon: <FiMail className="w-6 h-6" />,
    color: "from-violet-400 to-purple-500",
    shadow: "shadow-purple-200",
    bg: "bg-violet-50",
    label: "البريد الإلكتروني",
    value: "info@ring-of-joy.com",
    sub: "بنرد في خلال 24 ساعة",
    href: "mailto:info@ring-of-joy.com",
    cta: "ابعت إيميل",
  },
];

const SOCIAL = [
  {
    icon: <FiInstagram className="w-5 h-5" />,
    href: "https://www.instagram.com/ring.of.joy_donuts?igsh=dTN3OWkwNXhpZWtz",
    label: "Instagram",
    color: "hover:bg-pink-500",
  },
  {
    icon: <FaFacebook className="w-5 h-5" />,
    href: "https://www.facebook.com/share/1B3fWmB8dR/",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    icon: <FaTiktok className="w-5 h-5" />,
    href: "https://www.tiktok.com/@ring.of.joy_donuts?_r=1&_t=ZS-95JVcI0AFI0",
    label: "TikTok",
    color: "hover:bg-gray-800",
  },
  {
    icon: <FaWhatsapp className="w-5 h-5" />,
    href: "https://wa.me/201055961002",
    label: "WhatsApp",
    color: "hover:bg-green-500",
  },
];

const HOURS = [
  { day: "السبت — الخميس", time: "9:00 ص — 12:00 م" },
  { day: "الجمعة", time: "1:00 م — 12:00 م" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-rose-400 via-pink-500 to-pink-600 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 rounded-full bg-white/5 blur-sm" />
        <div
          className="absolute top-8 left-16 opacity-10"
          style={{ animation: "floatY 6s ease-in-out infinite" }}
        >
          <GiDonut className="w-20 h-20" />
        </div>
        <div
          className="absolute bottom-4 right-20 opacity-10"
          style={{
            animation: "floatY 8s ease-in-out infinite",
            animationDelay: "1.5s",
          }}
        >
          <GiDonut className="w-12 h-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <nav className="flex items-center gap-2 text-pink-200 text-sm mb-5 flex-wrap">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HiHome className="w-3.5 h-3.5" /> الرئيسية
            </Link>
            <HiArrowLeft className="w-3 h-3 opacity-50 rotate-180" />
            <span className="text-white font-bold">تواصل معنا</span>
          </nav>

          <p className="text-xs font-black tracking-[0.25em] uppercase text-pink-200 mb-3 flex items-center gap-2">
            <MdVerified className="w-4 h-4" /> نحن هنا لخدمتك
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3 drop-shadow-sm">
            تواصل معنا
          </h1>
          <p className="text-pink-100 text-lg font-light max-w-lg">
            عندك سؤال؟ عايز تعمل أوردر كبير؟ أو بس عايز تقولنا رأيك؟ — إحنا
            دايماً موجودين!
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-7 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <FiClock className="w-4 h-4" /> من 8 الصبح لـ 12 بالليل
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-bold">
              <FiClock className="w-4 h-4" /> 7 أيام في الأسبوع
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
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {/* ── Contact Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 -mt-2">
          {CONTACT_CARDS.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative bg-gray-50 hover:bg-white rounded-3xl p-6 border border-transparent hover:border-pink-100 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 overflow-hidden flex flex-col gap-4"
            >
              {/* Glow */}
              <div
                className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>

              {/* Info */}
              <div>
                <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">
                  {card.label}
                </p>
                <p className="font-black text-gray-800 text-lg leading-snug">
                  {card.value}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">{card.sub}</p>
              </div>

              {/* CTA */}
              <div
                className={`mt-auto flex items-center gap-2 text-sm font-bold bg-gradient-to-l ${card.color} bg-clip-text text-transparent`}
              >
                {card.cta}
                <HiArrowLeft className="w-3.5 h-3.5 text-pink-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* ── Map + Info ── */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Map */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-black text-gray-800">موقعنا</h2>
            </div>

            <div className="rounded-3xl overflow-hidden border border-pink-100 shadow-lg shadow-pink-50">
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ring Of Joy Location"
                className="w-full"
              />
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=30.7269152,31.7884938"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-pink-500 hover:text-pink-700 text-sm font-bold transition-colors"
            >
              <FiMapPin className="w-4 h-4" /> افتح في Google Maps
            </a>
          </div>

          {/* Right Column: Address + Hours + Social */}
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-gray-50 hover:bg-white rounded-3xl p-6 border border-transparent hover:border-pink-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md shadow-pink-200 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiMapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-2">
                العنوان
              </p>
              <p className="font-black text-gray-800 text-lg leading-snug mb-1">
                اول طريق كفر العدوي بجوار معرض ابو صالح للسيارات
              </p>
              <p className="text-gray-400 text-sm">فاقوس - الشرقية</p>
            </div>

            {/* Hours */}
            <div className="bg-gray-50 hover:bg-white rounded-3xl p-6 border border-transparent hover:border-pink-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-200 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiClock className="w-5 h-5" />
              </div>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-3">
                مواعيد العمل
              </p>
              <div className="space-y-2.5">
                {HOURS.map((h, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">
                      {h.day}
                    </span>
                    <span className="text-sm text-pink-600 font-black bg-pink-50 px-3 py-1 rounded-full">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
              {/* Live indicator */}
              {/* <div className="mt-4 flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-green-700">
                  متاحين دلوقتي
                </span>
              </div> */}
            </div>

            {/* Social */}
            <div className="bg-gray-50 hover:bg-white rounded-3xl p-6 border border-transparent hover:border-pink-100 hover:shadow-lg transition-all duration-300 group">
              {/* <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-md shadow-purple-200 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiInstagram className="w-5 h-5" />
              </div> */}
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-4">
                تابعنا على
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-11 h-11 rounded-2xl bg-white border border-gray-100 ${s.color} flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 hover:border-transparent shadow-sm`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <p className="text-s text-gray-400 mt-3 font-bold">
                شاركنا صورتك مع الدوناتس بتاعتنا وهنعمل لك repost!
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Banner ── */}
        <div className="relative mt-16 rounded-3xl overflow-hidden bg-gradient-to-l from-pink-500 via-rose-500 to-pink-600 p-10 text-white text-center">
          <div className="absolute -top-4 -right-4 opacity-10">
            <GiDonut className="w-28 h-28" />
          </div>
          <div className="absolute -bottom-6 -left-4 opacity-10">
            <GiDonut className="w-36 h-36" />
          </div>
          <div className="relative z-10">
            <p className="text-pink-200 text-sm font-bold tracking-widest uppercase mb-2">
              More Donuts, More Family
            </p>
            <h3 className="text-3xl md:text-4xl font-black mb-3">
              جاهز تطلب دلوقتي؟
            </h3>
            <p className="text-pink-100 font-light mb-7 max-w-md mx-auto">
              توصيل سريع في 30 دقيقة — طازة على بابك في أي وقت
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3.5 rounded-2xl font-black text-base hover:bg-pink-50 transition-colors shadow-xl shadow-pink-700/20"
            >
              <MdDeliveryDining className="w-5 h-5" />
              اطلب الآن
            </Link>
          </div>
        </div>
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
