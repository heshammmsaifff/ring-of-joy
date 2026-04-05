"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { GiDonut } from "react-icons/gi";
import { FiPercent, FiShoppingBag, FiCheck } from "react-icons/fi";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // ── حساب السعر النهائي ──────────────────────
  const price = parseFloat(product.price) || 0;
  const discVal = parseFloat(product.discount_value) || 0;
  const discType = product.discount_type || "fixed";

  const finalPrice =
    discVal > 0
      ? discType === "percentage"
        ? Math.max(0, price - (price * discVal) / 100)
        : Math.max(0, price - discVal)
      : price;

  const hasDiscount = discVal > 0;
  const discountPct = hasDiscount
    ? discType === "percentage"
      ? Math.round(discVal)
      : Math.round((discVal / price) * 100)
    : 0;

  // ── إضافة للسلة ─────────────────────────────
  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      image_url: product.image_url || null,
      finalPrice,
    });
    // تأثير تأكيد سريع
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-100/80 transition-all duration-400 hover:-translate-y-2 flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-pink-50 h-52">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GiDonut className="w-16 h-16 text-pink-200" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-0.5">
            <FiPercent className="w-3 h-3" />
            {discountPct}%
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
          <button
            onClick={handleAdd}
            className={`font-black text-sm px-6 py-2.5 rounded-2xl shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 ${
              added
                ? "bg-green-500 text-white"
                : "bg-white text-pink-600 hover:bg-pink-500 hover:text-white"
            }`}
          >
            {added ? (
              <>
                <FiCheck className="w-4 h-4" /> اتضاف!
              </>
            ) : (
              <>
                <FiShoppingBag className="w-4 h-4" /> أضف للسلة
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-gray-800 text-base mb-1 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-pink-600 font-black text-xl leading-none">
              {finalPrice.toFixed(2)} EGP
            </span>
            {hasDiscount && (
              <span className="text-gray-300 text-xs line-through mt-0.5">
                {price.toFixed(2)} EGP
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm font-black text-xl ${
              added
                ? "bg-green-500 text-white shadow-green-200"
                : "bg-pink-50 hover:bg-pink-500 text-pink-500 hover:text-white hover:shadow-md hover:shadow-pink-200"
            }`}
          >
            {added ? <FiCheck className="w-4 h-4" /> : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
