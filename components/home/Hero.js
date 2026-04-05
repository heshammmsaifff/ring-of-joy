"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import { HiArrowLeft } from "react-icons/hi";
import { FiStar } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";

const ROTATING_WORDS = ["Fresh", "Creamy", "Delightful", "Royal", "Delicious"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setAnimating(false);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      dir="rtl"
      className="relative min-h-[92vh] bg-[#FFF5F7] overflow-hidden flex items-center"
    >
      {/* ── Background blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-100/50 blur-2xl" />
      </div>

      {/* ── Floating donuts (decorative) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          {
            size: "w-14 h-14",
            top: "top-[12%]",
            left: "left-[8%]",
            delay: "0s",
            dur: "6s",
            op: "opacity-10",
          },
          {
            size: "w-8 h-8",
            top: "top-[70%]",
            left: "left-[12%]",
            delay: "1.5s",
            dur: "8s",
            op: "opacity-10",
          },
          {
            size: "w-16 h-16",
            top: "top-[18%]",
            left: "left-[72%]",
            delay: "0.8s",
            dur: "7s",
            op: "opacity-10",
          },
          {
            size: "w-7 h-7",
            top: "top-[78%]",
            left: "left-[78%]",
            delay: "2s",
            dur: "5s",
            op: "opacity-10",
          },
          {
            size: "w-12 h-12",
            top: "top-[48%]",
            left: "left-[4%]",
            delay: "3s",
            dur: "9s",
            op: "opacity-10",
          },
        ].map((d, i) => (
          <div
            key={i}
            className={`absolute ${d.size} ${d.top} ${d.left} ${d.op}`}
            style={{
              animation: `floatY ${d.dur} ease-in-out infinite`,
              animationDelay: d.delay,
            }}
          >
            <GiDonut className="w-full h-full text-pink-400" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-0">
          {/* ── Text Column ── */}
          <div className="flex flex-col items-start gap-6 order-2 lg:order-1">
            {/* Delivery badge */}
            <div className="flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2 shadow-sm shadow-pink-100 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <MdDeliveryDining className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold text-gray-600">
                توصيل سريع في خلال 30 دقيقة
              </span>
            </div>

            {/* Slogan */}
            <p className="text-sm font-black tracking-[0.2em] uppercase text-pink-400">
              More Donuts, More Family
            </p>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.15] tracking-tight">
              Ring Of Joy
              <br />
              <span className="">
                <span
                  key={wordIndex}
                  className={`inline-block transition-all duration-300 ${
                    animating
                      ? "opacity-0 translate-y-4 blur-sm"
                      : "opacity-100 translate-y-0 blur-0"
                  }`}
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </span>
              <br />
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-lg leading-relaxed max-w-md font-light">
              مش مجرد دوناتس — دي تجربة حلوة بتتعمل بأجود المكونات وبتوصلك طازة
              على بابك في أي وقت عايزها.
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-reverse -space-x-2">
                {["🧑", "👩", "👨", "👩‍🦱"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 border-2 border-white flex items-center justify-center text-sm shadow-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium mt-0.5">
                  أكتر من 12,000 عميل سعيد
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/products"
                className="group relative overflow-hidden flex items-center gap-2.5 bg-gradient-to-l from-pink-500 to-rose-500 text-white px-7 py-4 rounded-2xl font-black text-base shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:-translate-y-1 transition-all duration-300"
              >
                <GiDonut className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10">اطلب دلوقتي</span>
                <span className="absolute inset-0 bg-gradient-to-l from-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t border-pink-100 w-full">
              {[
                { num: "+50", label: "نوع دوناتس" },
                { num: "30m", label: "متوسط التوصيل" },
                { num: "4.9★", label: "تقييم العملاء" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <span className="text-xl font-black text-pink-600">
                    {stat.num}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Image Column ── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            {/* Glow */}
            <div className="absolute w-[380px] h-[380px] md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-br from-pink-300/40 to-rose-300/20 blur-2xl" />

            {/* Circle plate */}
            <img
              src="/logo.jpg"
              alt="Royal Donut"
              className="w-[78%] h-[78%] rounded-3xl object-contain drop-shadow-2xl"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Fallback */}
            <div className="hidden w-full h-full items-center justify-center">
              <GiDonut className="w-44 h-44 text-pink-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 0 480 60 720 40C960 20 1200 50 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease both;
        }
      `}</style>
    </section>
  );
}
