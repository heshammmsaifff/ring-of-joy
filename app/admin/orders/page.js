"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import { MdDeliveryDining } from "react-icons/md";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("خطأ في جلب البيانات: " + error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("فشل تحديث الحالة");
    } else {
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiRefreshCw className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              لوحة التحكم 🍩
            </h1>
            <p className="text-gray-500">إدارة الطلبات وتفاصيل المنتجات</p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all active:scale-95"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6"
            >
              {/* بيانات العميل والحالة */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-pink-50 text-pink-600 font-bold px-3 py-1 rounded-full text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {order.customer_name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                    <p>📞 {order.customer_phone}</p>
                    <p>📍 {order.delivery_address}</p>
                  </div>
                </div>

                {/* --- عـرض الـمـنـتـجـات (الجزء الجديد) --- */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 mb-3 border-b border-gray-200 pb-1">
                    محتويات الأوردر:
                  </p>
                  <div className="space-y-2">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          <span className="font-black text-pink-600">
                            {item.qty}x
                          </span>
                          <span className="font-bold text-gray-700">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-gray-500 font-medium">
                          {item.subtotal} EGP
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-dashed border-gray-300 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">
                      الإجمالي المطلوب:
                    </span>
                    <span className="text-lg font-black text-pink-600">
                      {order.total_price} EGP
                    </span>
                  </div>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex flex-wrap md:flex-col justify-center gap-2 min-w-[170px]">
                <ActionButton
                  label="تجهيز"
                  icon={<FiPackage />}
                  color="bg-blue-500"
                  onClick={() => updateStatus(order.id, "processing")}
                />
                <ActionButton
                  label="خارج للتوصيل"
                  icon={<FiTruck />}
                  color="bg-orange-500"
                  onClick={() => updateStatus(order.id, "shipping")}
                />
                <ActionButton
                  label="تم الاستلام"
                  icon={<FiCheckCircle />}
                  color="bg-green-500"
                  onClick={() => updateStatus(order.id, "completed")}
                />
                <ActionButton
                  label="إلغاء"
                  icon={<FiXCircle />}
                  color="bg-red-500"
                  onClick={() => updateStatus(order.id, "cancelled")}
                />
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              لا يوجد طلبات حالياً 😴
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Components تظل كما هي (StatusBadge, ActionButton)
function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "انتظار",
      color: "bg-gray-100 text-gray-600",
      icon: <FiClock />,
    },
    processing: {
      label: "تحضير",
      color: "bg-blue-100 text-blue-600",
      icon: <FiPackage />,
    },
    shipping: {
      label: "دليفري",
      color: "bg-orange-100 text-orange-600",
      icon: <MdDeliveryDining />,
    },
    completed: {
      label: "تم",
      color: "bg-green-100 text-green-600",
      icon: <FiCheckCircle />,
    },
    cancelled: {
      label: "ملغي",
      color: "bg-red-100 text-red-600",
      icon: <FiXCircle />,
    },
  };
  const current = config[status] || config.pending;
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] ${current.color}`}
    >
      {current.icon} {current.label}
    </span>
  );
}

function ActionButton({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-all active:scale-95 ${color} hover:brightness-110 shadow-sm`}
    >
      {icon} {label}
    </button>
  );
}
