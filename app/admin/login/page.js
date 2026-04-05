"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (type) => {
    if (!email || !password) return alert("يرجى ملء البيانات");

    setLoading(true);
    try {
      let result;
      if (type === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        // الـ Signup
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        // هذه الرسالة ستخبرك بالسبب الحقيقي للـ 422
        alert(`خطأ: ${result.error.message}`);
      } else {
        if (type === "signup") {
          alert("تم إنشاء الحساب! يرجى مراجعة إيميلك لتأكيد الحساب ");
        } else {
          router.push("/admin/dashboard");
        }
      }
    } catch (err) {
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4"
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-pink-50">
        <h1 className="text-2xl font-black text-center mb-6 text-gray-800">
          لوحة التحكم
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-pink-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="كلمة السر"
            className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-pink-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={() => handleAuth("login")}
            disabled={loading}
            className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold hover:bg-pink-600 transition-all"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>

          <button
            onClick={() => handleAuth("signup")}
            className="w-full text-pink-500 text-sm font-bold"
          >
            ليس لديك حساب؟ إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
}
