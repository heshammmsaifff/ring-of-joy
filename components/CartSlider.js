"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { GiDonut } from "react-icons/gi";
import { FiX, FiShoppingBag, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";

export default function CartSlider() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQty,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slider Panel */}
      <div
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center">
              <FiShoppingBag className="w-4 h-4 text-pink-500" />
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-base leading-none">
                سلة المشتريات
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{totalItems} منتج</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* ── Empty State ── */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center">
              <GiDonut className="w-12 h-12 text-pink-200" />
            </div>
            <div>
              <h3 className="font-black text-gray-700 text-lg">السلة فاضية!</h3>
              <p className="text-gray-400 text-sm mt-1">
                ابدأ اختر الدوناتس اللي تعجبك
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-7 py-3 rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-pink-200"
            >
              تصفح المنتجات
            </button>
          </div>
        )}

        {/* ── Items List ── */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-pink-100 flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GiDonut className="w-8 h-8 text-pink-200" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-800 text-sm leading-snug line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-pink-600 font-bold text-sm mt-0.5">
                      {item.finalPrice.toFixed(2)} EGP
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-all"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-gray-800 text-sm w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-all"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + Delete */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xs font-black text-gray-600">
                      {(item.finalPrice * item.qty).toFixed(2)} EGP
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-300 hover:border-red-300 hover:text-red-400 transition-all"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-100 px-5 py-5 space-y-4 flex-shrink-0 bg-white">
              {/* Delivery note */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                <MdDeliveryDining className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-700 font-bold">
                  توصيل سريع في خلال 30 دقيقة 🛵
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-gray-700">
                    {totalPrice.toFixed(2)} EGP
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>رسوم التوصيل</span>
                  <span className="text-green-600 font-bold">مجاني 🎉</span>
                </div>
                <div className="flex items-center justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-100">
                  <span>الإجمالي</span>
                  <span className="text-pink-600">
                    {totalPrice.toFixed(2)} EGP
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                <MdDeliveryDining className="w-5 h-5" />
                إتمام الطلب
              </Link>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-400 hover:text-red-400 transition-colors font-medium py-1"
              >
                مسح السلة كلها
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
