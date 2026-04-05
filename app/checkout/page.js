"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { GiDonut } from "react-icons/gi";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiChevronLeft,
} from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { HiHome } from "react-icons/hi";

const EMPTY_FORM = {
  customer_name: "",
  customer_phone: "",
  customer_phone_2: "",
  delivery_address: "",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = "اكتب اسمك";
    if (!form.customer_phone.trim()) e.customer_phone = "اكتب رقم موبايلك";
    else if (!/^01[0125]\d{8}$/.test(form.customer_phone.trim()))
      e.customer_phone = "رقم موبايل مصري غير صحيح";

    if (
      form.customer_phone_2.trim() &&
      !/^01[0125]\d{8}$/.test(form.customer_phone_2.trim())
    ) {
      e.customer_phone_2 = "رقم الموبايل الإضافي غير صحيح";
    }

    if (!form.delivery_address.trim())
      e.delivery_address = "اكتب العنوان بالتفصيل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (items.length === 0) return;

    setLoading(true);
    try {
      // تجهيز مصفوفة المنتجات لإرسالها في حقل jsonb
      const orderItemsData = items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.finalPrice,
        subtotal: item.qty * item.finalPrice,
      }));

      const insertData = {
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        delivery_address: form.customer_phone_2.trim()
          ? `${form.delivery_address.trim()} (رقم إضافي: ${form.customer_phone_2.trim()})`
          : form.delivery_address.trim(),
        total_price: parseFloat(totalPrice.toFixed(2)),
        status: "pending",
        order_items: orderItemsData, // الحقل الجديد
      };

      const { data, error } = await supabase
        .from("orders")
        .insert(insertData)
        .select("id")
        .single();

      if (error) throw error;

      setOrderId(data.id.slice(0, 8).toUpperCase());
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert("حصل خطأ أثناء تسجيل الطلب: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... باقي كود Success Screen و Empty Cart (بدون تغيير) ...
  if (success) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/80 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            تم الطلب! 🎉
          </h2>
          <p className="text-gray-400 mb-1 text-sm">رقم طلبك</p>
          <p className="text-2xl font-black text-pink-600 mb-5 tracking-widest">
            #{orderId}
          </p>
          <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-7">
            <div className="flex items-center gap-2 justify-center text-green-700 font-bold text-sm">
              <MdDeliveryDining className="w-5 h-5" /> الاوردر هيكون وصلك خلال
              30 دقيقة
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-md shadow-pink-200"
            >
              <HiHome className="w-4 h-4" /> الرئيسية
            </Link>
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-pink-200 text-pink-600 hover:bg-pink-50 py-3.5 rounded-2xl font-bold transition-colors"
            >
              <GiDonut className="w-4 h-4" /> اطلب اوردر تاني
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4"
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <GiDonut className="w-12 h-12 text-pink-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-700 mb-2">
            السلة فاضية!
          </h2>
          <p className="text-gray-400 mb-7">محتاج تضيف منتجات الأول</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
          >
            <GiDonut className="w-4 h-4" /> تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFF5F7] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-pink-500 transition-colors mb-4"
          >
            <HiHome className="w-4 h-4" /> الرئيسية{" "}
            <FiChevronLeft className="w-3.5 h-3.5 rotate-180" />
            <span className="text-gray-600 font-semibold">إتمام الطلب</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900">إتمام الطلب 🍩</h1>
          <p className="text-gray-400 mt-1">اكتب بياناتك وهنوصلك في أسرع وقت</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-5">
            <FormSection
              title="بياناتك الشخصية"
              icon={<FiUser className="w-4 h-4 text-pink-500" />}
            >
              <div className="space-y-4">
                <Field label="الاسم بالكامل *" error={errors.customer_name}>
                  <input
                    type="text"
                    placeholder="مثال: محمد أحمد"
                    value={form.customer_name}
                    onChange={(e) => set("customer_name", e.target.value)}
                    className={inputClass(errors.customer_name)}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="رقم الموبايل الأساسي *"
                    error={errors.customer_phone}
                  >
                    <input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                      value={form.customer_phone}
                      onChange={(e) => set("customer_phone", e.target.value)}
                      className={`${inputClass(errors.customer_phone)} text-left`}
                    />
                  </Field>
                  <Field
                    label="رقم موبايل إضافي (اختياري)"
                    error={errors.customer_phone_2}
                  >
                    <input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                      value={form.customer_phone_2}
                      onChange={(e) => set("customer_phone_2", e.target.value)}
                      className={`${inputClass(errors.customer_phone_2)} text-left`}
                    />
                  </Field>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="عنوان التوصيل"
              icon={<FiMapPin className="w-4 h-4 text-pink-500" />}
            >
              <Field label="العنوان بالتفصيل *" error={errors.delivery_address}>
                <textarea
                  placeholder="المنطقة، اسم الشارع، رقم العمارة، الدور، الشقة، وأي علامة مميزة..."
                  rows={4}
                  value={form.delivery_address}
                  onChange={(e) => set("delivery_address", e.target.value)}
                  className={`${inputClass(errors.delivery_address)} resize-none`}
                />
              </Field>
            </FormSection>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-l from-pink-50 to-rose-50">
              <h3 className="font-black text-gray-800 flex items-center gap-2">
                <GiDonut className="w-5 h-5 text-pink-500" /> ملخص الطلب
              </h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GiDonut className="w-5 h-5 text-pink-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-700 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.qty} × {item.finalPrice.toFixed(2)} EGP
                    </p>
                  </div>
                  <p className="font-black text-gray-800 text-sm flex-shrink-0">
                    {(item.qty * item.finalPrice).toFixed(2)} EGP
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 space-y-2 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-gray-700">
                  {totalPrice.toFixed(2)} EGP
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>التوصيل</span>
                <span className="text-green-600 font-bold">مجاني 🎉</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 text-xl pt-2 border-t border-gray-100">
                <span>الإجمالي</span>
                <span className="text-pink-600">
                  {totalPrice.toFixed(2)} EGP
                </span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-pink-500 to-rose-500 disabled:opacity-70 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <MdDeliveryDining className="w-5 h-5" />
                )}
                {loading ? "جاري تسجيل طلبك..." : "اطلب دلوقتي 🍩"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers (inputClass, FormSection, Field) تظل كما هي في كودك الأصلي
function inputClass(error) {
  return `w-full border-[1.5px] rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition-all font-medium bg-white ${
    error
      ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(252,165,165,0.2)]"
      : "border-pink-100 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)]"
  }`;
}
function FormSection({ title, icon, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-l from-pink-50/50 to-rose-50/50">
        {icon} <h3 className="font-black text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-600">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
