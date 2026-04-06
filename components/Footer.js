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

// رابط Google Maps Embed — غيّره بالرابط الحقيقي من Google Maps
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3237.23541416473!2d31.791585951291342!3d30.725950581577337!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f825000831c131%3A0x59d66b313a1fb24e!2sRING%20OF%20JOY!5e0!3m2!1sen!2sus!4v1775485195208!5m2!1sen!2sus";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/products" },
  { label: "العروض", href: "/offers" },
  { label: "تواصل معنا", href: "/contact" },
];

const SOCIAL = [
  {
    icon: <FiInstagram className="w-4 h-4" />,
    href: "https://www.instagram.com/ring.of.joy_donuts?igsh=dTN3OWkwNXhpZWtz",
    label: "Instagram",
  },
  {
    icon: <FaFacebook className="w-4 h-4" />,
    href: "https://www.facebook.com/share/1B3fWmB8dR/",
    label: "Facebook",
  },
  {
    icon: <FaTiktok className="w-4 h-4" />,
    href: "https://www.tiktok.com/@ring.of.joy_donuts?_r=1&_t=ZS-95JVcI0AFI0",
    label: "TikTok",
  },
  {
    icon: <FaWhatsapp className="w-4 h-4" />,
    href: "https://wa.me/201055961002",
    label: "WhatsApp",
  },
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
                  target="_blank"
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
                  <p className="text-gray-500 text-xs mb-0.5">موبايل</p>
                  <a
                    href="tel:+201055961002"
                    className="text-gray-300 hover:text-pink-400 text-sm font-medium transition-colors"
                  >
                    01055961002
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
                    href="https://wa.me/201055961002"
                    className="text-gray-300 hover:text-green-400 text-sm font-medium transition-colors"
                  >
                    01055961002
                  </a>
                </div>
              </li>
              {/* <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMail className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">ايميل</p>
                  <a
                    href="mailto:info@ring-of-joy.com"
                    className="text-gray-300 hover:text-pink-400 text-sm font-medium transition-colors"
                  >
                    info@ring-of-joy.com
                  </a>
                </div>
              </li> */}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiClock className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">مواعيد العمل</p>
                  <p className="text-gray-300 text-sm font-medium">
                    يومياً من 9 ص — 2 م
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
                title="Ring Of Joy Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=30.7269152,31.7884938"
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
