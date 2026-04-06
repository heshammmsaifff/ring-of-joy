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
import { MdLocalOffer } from "react-icons/md";

export default function OfferCard({ offer, index = 0 }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const disc =
    offer.original_price > 0
      ? Math.round(
          ((offer.original_price - offer.final_price) / offer.original_price) *
            100,
        )
      : 0;
  const saving = (offer.original_price - offer.final_price).toFixed(2);
  const final = parseFloat(offer.final_price);

  const handleAdd = (q = 1) => {
    for (let i = 0; i < q; i++) {
      addItem({
        id: offer.id,
        name: offer.name,
        image_url: offer.image_url || null,
        finalPrice: final,
      });
    }
    addToast({ message: `${offer.name} اتضاف للسلة ` });
    setModalOpen(false);
    setQty(1);
  };

  return (
    <>
      {/* ── Card ── */}
      <div
        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-100 hover:-translate-y-1.5 transition-all duration-400 flex flex-col"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
          {offer.image_url ? (
            <img
              src={offer.image_url}
              alt={offer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GiDonut className="w-20 h-20 text-pink-200" />
            </div>
          )}

          {/* Discount badge */}
          <div className="absolute top-3 right-3 bg-rose-500 text-white font-black text-xs px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <FiPercent className="w-3 h-3" />
            {disc}%
          </div>

          {/* Saving ribbon on hover */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between">
            <p className="text-white font-black text-xs">
              وفّر {saving} EGP 💰
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-white/30 transition-colors"
            >
              <FiEye className="w-3 h-3" /> التفاصيل
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-black text-gray-800 text-sm leading-snug line-clamp-1 mb-1">
            {offer.name}
          </h3>
          {offer.description && (
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed flex-1">
              {offer.description}
            </p>
          )}

          {/* Price + buttons */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 gap-2">
            <div>
              <p className="text-pink-600 font-black text-lg leading-none">
                {final.toFixed(2)} EGP
              </p>
              <p className="text-gray-300 text-xs line-through mt-0.5">
                {offer.original_price} EGP
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {/* زر عرض التفاصيل - الآن مع نص وأيقونة */}
              <button
                onClick={() => setModalOpen(true)}
                className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] text-sm font-bold"
              >
                <FiEye className="w-4 h-4" />
                <span>عرض التفاصيل</span>
              </button>

              {/* زر أضف للسلة */}
              <button
                onClick={() => handleAdd(1)}
                className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white h-10 rounded-xl font-black text-sm transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md hover:shadow-pink-200"
              >
                <FiShoppingBag className="w-4 h-4" />
                أضف للسلة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <OfferModal
          offer={offer}
          disc={disc}
          saving={saving}
          final={final}
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

// ── Offer Modal ───────────────────────────────
function OfferModal({
  offer,
  disc,
  saving,
  final,
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
          {offer.image_url ? (
            <img
              src={offer.image_url}
              alt={offer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GiDonut className="w-24 h-24 text-pink-200" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <FiPercent className="w-3.5 h-3.5" />
              {disc}% خصم
            </div>
            <div className="bg-amber-400 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <MdLocalOffer className="w-3.5 h-3.5" /> عرض محدود
            </div>
          </div>

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
          <h2 className="text-2xl font-black text-gray-900 mb-2 leading-snug">
            {offer.name}
          </h2>

          {offer.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {offer.description}
            </p>
          )}

          {/* Price comparison */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">
                  السعر بعد الخصم
                </p>
                <p className="text-3xl font-black text-pink-600">
                  {final.toFixed(2)} EGP
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold mb-1">
                  السعر الأصلي
                </p>
                <p className="text-lg text-gray-300 line-through">
                  {offer.original_price} EGP
                </p>
              </div>
              <div className="text-center bg-rose-500 text-white rounded-2xl px-4 py-3">
                <p className="text-xs font-bold">وفّر</p>
                <p className="text-xl font-black">{saving} EGP</p>
              </div>
            </div>
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-3">
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

            <button
              onClick={() => onAdd(qty)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FiShoppingBag className="w-4 h-4" />
              أضف للسلة — {(final * qty).toFixed(2)} EGP
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
