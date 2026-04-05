"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { GiDonut } from "react-icons/gi";
import { FiPercent, FiCheck } from "react-icons/fi";

export default function OfferCard({ offer, index = 0 }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const disc =
    offer.original_price > 0
      ? Math.round(
          ((offer.original_price - offer.final_price) / offer.original_price) *
            100,
        )
      : 0;
  const saving = (offer.original_price - offer.final_price).toFixed(0);

  const handleAdd = () => {
    addItem({
      id: offer.id,
      name: offer.name,
      image_url: offer.image_url || null,
      finalPrice: parseFloat(offer.final_price),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-100 hover:-translate-y-2 transition-all duration-400 flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 bg-pink-50 overflow-hidden">
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
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-black text-sm">وفّر {saving} EGP 💰</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-gray-800 text-base leading-snug line-clamp-1">
          {offer.name}
        </h3>
        {offer.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed flex-1">
            {offer.description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div>
            <p className="text-pink-600 font-black text-xl leading-none">
              {offer.final_price} EGP
            </p>
            <p className="text-gray-300 text-xs line-through mt-0.5">
              {offer.original_price} EGP
            </p>
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
