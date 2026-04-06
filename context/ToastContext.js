"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import { GiDonut } from "react-icons/gi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "success", duration = 3000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        duration,
      );
    },
    [],
  );

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* ── Toast Container ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-bold min-w-[240px] max-w-xs
              animate-toast-in
              ${
                toast.type === "success"
                  ? "bg-gray-900"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
              }`}
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                toast.type === "success" ? "bg-pink-500" : "bg-white/20"
              }`}
            >
              {toast.type === "success" ? (
                <GiDonut className="w-4 h-4 text-white" />
              ) : toast.type === "error" ? (
                <FiAlertCircle className="w-4 h-4" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
            </div>

            <span className="flex-1">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .animate-toast-in { animation: toast-in 0.25s ease both; }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
