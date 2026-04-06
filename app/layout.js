import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "Ring Of Joy",
  description: "أفخم أنواع الدونات المميزة في مصر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body
        className={`${cairo.className} min-h-screen flex flex-col bg-white text-gray-900 antialiased`}
      >
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
          </ToastProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
