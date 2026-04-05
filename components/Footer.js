import Link from "next/link";
import Image from "next/image";
import { GiDonut } from "react-icons/gi";
import {
  FiInstagram,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

// ↓ غيّر الإحداثيات دي لإحداثيات المحل الحقيقية
const MAP_LAT = 30.0444;
const MAP_LNG = 31.2357;
const MAP_ZOOM = 16;
// رابط Google Maps Embed — غيّره بالرابط الحقيقي من Google Maps
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=${MAP_ZOOM}&output=embed`;

const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/products" },
  { label: "العروض", href: "/offers" },
  { label: "تواصل معنا", href: "/contact" },
];

const SOCIAL = [
  { icon: <FiInstagram className="w-4 h-4" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="w-4 h-4" />, href: "#", label: "Facebook" },
  { icon: <FaTiktok className="w-4 h-4" />, href: "#", label: "TikTok" },
  { icon: <FaWhatsapp className="w-4 h-4" />, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-gray-900 text-white">
      {/* ── CTA Banner ── */}
      <div className="bg-gradient-to-l from-pink-600 via-rose-500 to-pink-600 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div>
            <h3 className="text-2xl md:text-3xl font-black mb-1">
              جاهز تطلب دلوقتي؟
            </h3>
            <p className="text-pink-100 font-light">
              توصيل سريع — على بابك في 30 دقيقة
            </p>
          </div>
          <Link
            href="/products"
            className="flex-shrink-0 flex items-center gap-2 bg-white text-pink-600 px-8 py-3.5 rounded-2xl font-black text-base hover:bg-pink-50 transition-colors shadow-xl shadow-pink-700/20"
          >
            <MdDeliveryDining className="w-5 h-5" />
            اطلب الآن
          </Link>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Brand Column ── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              دوناتس بأجود المكونات — بتوصلك على بابك كل يوم من الصبح لآخر
              الليل.
            </p>
            <p className="text-pink-400 font-black text-sm tracking-widest uppercase">
              More Donuts, More Family
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav Links ── */}
          <div>
            <h4 className="font-black text-white mb-5 flex items-center gap-2">
              <GiDonut className="w-4 h-4 text-pink-400" /> روابط سريعة
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-pink-400 text-sm font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info ── */}
          <div>
            <h4 className="font-black text-white mb-5 flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-pink-400" /> تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiPhone className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">الهاتف</p>
                  <a
                    href="tel:+201234567890"
                    className="text-gray-300 hover:text-pink-400 text-sm font-medium transition-colors"
                  >
                    01234-567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaWhatsapp className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">واتساب</p>
                  <a
                    href="https://wa.me/201234567890"
                    className="text-gray-300 hover:text-green-400 text-sm font-medium transition-colors"
                  >
                    01234-567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMail className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">البريد</p>
                  <a
                    href="mailto:hello@royaldonuts.com"
                    className="text-gray-300 hover:text-pink-400 text-sm font-medium transition-colors"
                  >
                    hello@royaldonuts.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiClock className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">مواعيد العمل</p>
                  <p className="text-gray-300 text-sm font-medium">
                    يومياً من 8 ص — 12 م
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* ── Map ── */}
          <div>
            <h4 className="font-black text-white mb-5 flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-pink-400" /> موقعنا
            </h4>

            <p className="text-gray-400 text-sm mb-4 flex items-start gap-2">
              <FiMapPin className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
              <span>
                اول طريق كفر العدوي بجوار معرض ابو صالح للسيارات - فاقوس -
                الشرقية
              </span>
            </p>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Royal Donuts Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <a
              href={`https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-pink-400 hover:text-pink-300 text-xs font-bold transition-colors"
            >
              <FiMapPin className="w-3.5 h-3.5" />
              افتح في Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-800 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Hesham Saif — جميع الحقوق محفوظة
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            صُنع بـ كتير من الحب في مصر 🇪🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
