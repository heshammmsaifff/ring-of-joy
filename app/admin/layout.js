"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // تأكد من مسار ملف السوبابيز عندك
import { GiDonut } from "react-icons/gi";
import {
  MdDashboard,
  MdLocalOffer,
  MdCategory,
  MdMenu,
  MdClose,
  MdLogout,
  MdRefresh,
} from "react-icons/md";

import { FaCartArrowDown } from "react-icons/fa";
import { HiChevronLeft } from "react-icons/hi";

const NAV_ITEMS = [
  {
    label: "الداشبورد",
    href: "/admin/dashboard",
    icon: <MdDashboard className="w-5 h-5" />,
    desc: "المنتجات",
  },
  {
    label: "الأقسام",
    href: "/admin/categories",
    icon: <MdCategory className="w-5 h-5" />,
    desc: "إدارة الأقسام",
  },
  {
    label: "العروض",
    href: "/admin/offers",
    icon: <MdLocalOffer className="w-5 h-5" />,
    desc: "العروض والخصومات",
  },
  {
    label: "الطلبات",
    href: "/admin/orders",
    icon: <FaCartArrowDown className="w-5 h-5" />,
    desc: "الطلبات",
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // حالات الحماية
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      // إذا كنا في صفحة اللوجن، لا تفعل شيئاً
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      try {
        // 1. جلب بيانات المستخدم الحالي
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/admin/login");
          return;
        }

        // 2. جلب صلاحية الأدمن من جدول profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profileError || !profile?.is_admin) {
          // إذا لم يكن أدمن، سجل خروجه وارجعه للوجن
          await supabase.auth.signOut();
          router.push("/admin/login");
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // شاشة التحميل (Spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600 gap-4">
        <MdRefresh className="w-10 h-10 animate-spin text-pink-500" />
        <p className="font-bold animate-pulse">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // إذا كنا في صفحة اللوجن، اعرض المحتوى بدون الـ Sidebar
  if (pathname === "/admin/login") {
    return <main>{children}</main>;
  }

  // إذا تم التأكد أنه أدمن، اعرض التصميم الكامل
  return isAdmin ? (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 right-0 h-screen bg-gray-900 text-white z-50 flex flex-col
          transition-all duration-300 ease-in-out shadow-2xl
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ── */}
        <div
          className={`flex items-center border-b border-gray-800 flex-shrink-0 transition-all duration-300 ${collapsed ? "justify-center p-4" : "gap-3 px-5 py-4"}`}
        >
          <div className="w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
            <GiDonut className="w-5 h-5 text-white" />
          </div>

          {/* {!collapsed && (
            <div className="overflow-hidden">
              <div className="relative h-7 w-28">
                <Image
                  src="/logo.jpg"
                  alt="Royal Donuts"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
          )} */}

          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0 ${collapsed ? "mx-auto mt-2 rotate-180" : "mr-auto"}`}
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase px-5 mb-3">
              القائمة
            </p>
          )}

          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`
                      flex items-center rounded-xl transition-all duration-200 group relative
                      ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}
                      ${
                        isActive
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    {/* Icon */}
                    <span
                      className={`flex-shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    {!collapsed && (
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm leading-none">
                          {item.label}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 leading-none ${isActive ? "text-pink-200" : "text-gray-500 group-hover:text-gray-400"}`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    )}

                    {/* Active dot */}
                    {isActive && !collapsed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0" />
                    )}

                    {/* Collapsed tooltip */}
                    {collapsed && (
                      <div className="absolute left-full mr-3 right-auto translate-x-[-8px] group-hover:translate-x-[-12px] bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Footer Logout ── */}
        <div
          className={`border-t border-gray-800 p-3 flex-shrink-0 ${collapsed ? "flex justify-center" : ""}`}
        >
          <button
            onClick={handleLogout}
            title={collapsed ? "تسجيل الخروج" : undefined}
            className={`w-full flex items-center gap-3 text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 group ${collapsed ? "p-3 justify-center" : "px-4 py-3"}`}
          >
            <MdLogout className="w-5 h-5 flex-shrink-0 rotate-180" />
            {!collapsed && (
              <span className="text-sm font-bold">تسجيل الخروج</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        {/* Mobile Top Bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-xl flex items-center justify-center">
              <GiDonut className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-800 text-sm">
              {NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ||
                "لوحة التحكم"}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? (
              <MdClose className="w-6 h-6" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  ) : null;
}
