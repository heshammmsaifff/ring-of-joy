"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { GiDonut } from "react-icons/gi";
import {
  FiPercent,
  FiShoppingBag,
  FiCheck,
  FiX,
  FiEye,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(1);

  // ── Price calc ───────────────────────────────
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

  // ── Add to cart ──────────────────────────────
  const handleAdd = (e, q = 1) => {
    e?.stopPropagation();
    for (let i = 0; i < q; i++) {
      addItem({
        id: product.id,
        name: product.name,
        image_url: product.image_url || null,
        finalPrice,
      });
    }
    addToast({ message: `${product.name} اتضاف للسلة` });
    setModalOpen(false);
    setQty(1);
  };

  return (
    <>
      {/* ── Card ── */}
      <div
        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-100/80 transition-all duration-400 hover:-translate-y-1.5 flex flex-col"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 h-52">
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

          {/* Hover overlay — quick view */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 font-black text-xs px-4 py-2 rounded-xl shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white"
            >
              <FiEye className="w-3.5 h-3.5 text-pink-500" /> عرض التفاصيل
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-black text-gray-800 text-sm mb-1 leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-2">
              {product.description}
            </p>
          )}

          {/* Price + buttons */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 gap-2">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-pink-600 font-black text-lg leading-none">
                {finalPrice.toFixed(2)} EGP
              </span>
              {hasDiscount && (
                <span className="text-gray-300 text-xs line-through mt-0.5">
                  {price.toFixed(2)} EGP
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full">
              {/* Details */}
              <button
                onClick={() => setModalOpen(true)}
                className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] text-sm font-bold"
              >
                <FiEye className="w-4 h-4" />
                <span>عرض التفاصيل</span>
              </button>
              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white h-10 rounded-xl font-black text-sm transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md hover:shadow-pink-200"
              >
                <FiShoppingBag className="w-3.5 h-3.5" />
                أضف
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <ProductModal
          product={product}
          finalPrice={finalPrice}
          hasDiscount={hasDiscount}
          discountPct={discountPct}
          price={price}
          qty={qty}
          setQty={setQty}
          onAdd={handleAdd}
          onClose={() => {
            setModalOpen(false);
            setQty(1);
          }}
        />
      )}
    </>
  );
}

// ── Modal Component ───────────────────────────
function ProductModal({
  product,
  finalPrice,
  hasDiscount,
  discountPct,
  price,
  qty,
  setQty,
  onAdd,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-pink-50 to-rose-50">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GiDonut className="w-24 h-24 text-pink-200" />
            </div>
          )}

          {/* Badges */}
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <FiPercent className="w-3.5 h-3.5" />
              {discountPct}% خصم
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm hover:bg-white transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6">
          {/* Category tag */}
          {product.categories?.name && (
            <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-500 text-xs font-black px-3 py-1 rounded-full mb-3">
              <GiDonut className="w-3 h-3" /> {product.categories.name}
            </span>
          )}

          <h2 className="text-2xl font-black text-gray-900 mb-2 leading-snug">
            {product.name}
          </h2>

          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-pink-600">
              {finalPrice.toFixed(2)} EGP
            </span>
            {hasDiscount && (
              <>
                <span className="text-gray-300 text-lg line-through">
                  {price.toFixed(2)} EGP
                </span>
                <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-1 rounded-full">
                  وفّر {(price - finalPrice).toFixed(2)} EGP
                </span>
              </>
            )}
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-3">
            {/* Qty control */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-all shadow-sm"
              >
                <FiMinus className="w-3 h-3" />
              </button>
              <span className="font-black text-gray-800 w-6 text-center text-lg">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-all shadow-sm"
              >
                <FiPlus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={(e) => onAdd(e, qty)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FiShoppingBag className="w-4 h-4" />
              أضف للسلة — {(finalPrice * qty).toFixed(2)} EGP
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.95) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.25s ease both; }
      `}</style>
    </div>
  );
}
