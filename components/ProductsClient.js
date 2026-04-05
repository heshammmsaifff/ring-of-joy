"use client";
import { useState, useMemo } from "react";
import { GiDonut } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { MdGridView } from "react-icons/md";

export default function ProductsClient({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all")
      list = list.filter((p) => p.category_id === activeCategory);
    if (search.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()),
      );
    return list;
  }, [products, activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-6">
      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <GiDonut className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border-[1.5px] border-pink-100 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,0.1)] outline-none text-sm text-gray-700 bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeCategory === "all"
                ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                : "bg-white text-gray-500 border border-gray-100 hover:border-pink-200 hover:text-pink-500"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-pink-200 hover:text-pink-500"
              }`}
            >
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover"
                />
              )}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count ── */}
      <p className="text-sm text-gray-400 font-medium flex items-center gap-2 mb-6">
        <MdGridView className="w-4 h-4 text-pink-400" />
        عرض <span className="font-black text-gray-700">
          {filtered.length}
        </span>{" "}
        {/* منتج
        {activeCategory !== "all" && (
          <span className="text-pink-400">
            في "{categories.find((c) => c.id === activeCategory)?.name}"
          </span>
        )} */}
      </p>

      {/* ── Empty ── */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <GiDonut className="w-10 h-10 text-pink-200" />
          </div>
          <h3 className="text-xl font-black text-gray-600 mb-2">مفيش نتايج</h3>
          <p className="text-gray-400 text-sm mb-5">
            جرب تبحث بكلمة تانية أو اختار قسم مختلف
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-600 transition-colors text-sm"
          >
            عرض الكل
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
