"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdCheck,
  MdCloudUpload,
} from "react-icons/md";
import { FiPercent, FiTag } from "react-icons/fi";
import { GiDonut } from "react-icons/gi";

const BUCKET = "donuts-images";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discount_value: 0,
  discount_type: "fixed",
  category_id: "",
  image_url: "",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ── helpers ──────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const calcFinalPrice = (price, discVal, discType) => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discVal) || 0;
    if (discType === "percentage")
      return Math.max(0, p - (p * d) / 100).toFixed(2);
    return Math.max(0, p - d).toFixed(2);
  };

  // ── data ─────────────────────────────────────────
  const fetchInitialData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
    ]);
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  };

  // ── modal ─────────────────────────────────────────
  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      discount_value: product.discount_value,
      discount_type: product.discount_type,
      category_id: product.category_id || "",
      image_url: product.image_url || "",
    });
    setImageFile(null);
    setImagePreview(product.image_url || "");
    setModalOpen(true);
  };

  // ── image ─────────────────────────────────────────
  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024)
      return showToast("الصورة أكبر من 10MB", "error");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressed = await imageCompression(file, options);
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, compressed);
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const deleteOldImage = async (url) => {
    if (!url || !url.includes(BUCKET)) return;
    const path = url.split(`${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  };

  // ── save ─────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return showToast("اكتب اسم المنتج", "error");
    if (!form.price) return showToast("اكتب السعر", "error");

    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        if (editProduct?.image_url) await deleteOldImage(editProduct.image_url);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        discount_value: parseFloat(form.discount_value || 0),
        discount_type: form.discount_type,
        category_id: form.category_id || null,
        image_url: imageUrl || null,
      };

      const { error } = editProduct
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", editProduct.id)
        : await supabase.from("products").insert([payload]);

      if (error) throw error;

      showToast(editProduct ? "تم تعديل المنتج ✅" : "تم إضافة المنتج ✅");
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      showToast("حصل خطأ: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const product = products.find((p) => p.id === id);
    if (product?.image_url) await deleteOldImage(product.image_url);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return showToast("مقدرناش نحذف المنتج", "error");
    showToast("تم حذف المنتج");
    setDeleteId(null);
    fetchInitialData();
  };

  // ── render ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl font-bold text-white text-sm transition-all ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center">
            <GiDonut className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">إدارة المنتجات</h1>
            <p className="text-xs text-gray-400">{products.length} منتج مضاف</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5"
        >
          <MdAdd className="w-5 h-5" />
          إضافة منتج
        </button>
      </div>

      {/* Products Table */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-24">
            <GiDonut className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-600 mb-1">
              مفيش منتجات لحد دلوقتي
            </h3>
            <p className="text-gray-400 text-sm mb-6">ابدأ بإضافة أول منتج</p>
            <button
              onClick={openAdd}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              + إضافة منتج
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
              <span>المنتج</span>
              <span>القسم</span>
              <span>السعر الأصلي</span>
              <span>السعر النهائي</span>
              <span>إجراءات</span>
            </div>

            <div className="divide-y divide-gray-50">
              {products.map((p) => {
                const final = calcFinalPrice(
                  p.price,
                  p.discount_value,
                  p.discount_type,
                );
                const hasDiscount = parseFloat(p.discount_value) > 0;
                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-pink-50/40 transition-colors"
                  >
                    {/* Product */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <GiDonut className="w-5 h-5 text-pink-200" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 text-sm truncate">
                          {p.name}
                        </p>
                        {p.description && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <span className="text-sm text-gray-500 font-medium">
                      {p.categories?.name || (
                        <span className="text-gray-300">—</span>
                      )}
                    </span>

                    {/* Original price */}
                    <span
                      className={`text-sm font-bold ${hasDiscount ? "line-through text-gray-300" : "text-gray-700"}`}
                    >
                      {p.price} EGP
                    </span>

                    {/* Final price */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-pink-600">
                        {final} EGP
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] bg-rose-100 text-rose-500 font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <FiPercent className="w-2.5 h-2.5" />
                          {p.discount_type === "percentage"
                            ? `${p.discount_value}%`
                            : `${p.discount_value} EGP`}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">
                {editProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
              {/* Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  صورة المنتج
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl cursor-pointer group transition-all ${
                    imagePreview
                      ? "border-pink-300 bg-pink-50/30"
                      : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/30"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-40 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm flex items-center gap-2">
                          <MdCloudUpload className="w-5 h-5" /> تغيير الصورة
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview("");
                          setForm({ ...form, image_url: "" });
                        }}
                        className="absolute top-2 left-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                      <MdCloudUpload className="w-10 h-10 text-pink-300" />
                      <p className="font-bold text-sm text-gray-600">
                        اسحب الصورة هنا أو اضغط للاختيار
                      </p>
                      <p className="text-xs">
                        PNG, JPG, WEBP — بيتتحوّل WebP تلقائياً
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
              </div>

              {/* Name */}
              <Field label="اسم المنتج *">
                <input
                  type="text"
                  placeholder="مثال: دونات شوكولاتة بلجيكي"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-style"
                />
              </Field>

              {/* Description */}
              <Field label="الوصف">
                <textarea
                  placeholder="وصف قصير للمنتج..."
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-style resize-none"
                />
              </Field>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="السعر (EGP) *">
                  <input
                    type="number"
                    placeholder="50"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="input-style"
                  />
                </Field>
                <Field label="القسم">
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className="input-style bg-white"
                  >
                    <option value="">بدون قسم</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="قيمة الخصم">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={form.discount_value}
                    onChange={(e) =>
                      setForm({ ...form, discount_value: e.target.value })
                    }
                    className="input-style"
                  />
                </Field>
                <Field label="نوع الخصم">
                  <select
                    value={form.discount_type}
                    onChange={(e) =>
                      setForm({ ...form, discount_type: e.target.value })
                    }
                    className="input-style bg-white"
                  >
                    <option value="fixed">مبلغ ثابت (EGP)</option>
                    <option value="percentage">نسبة مئوية (%)</option>
                  </select>
                </Field>
              </div>

              {/* Discount preview */}
              {form.price && parseFloat(form.discount_value) > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-bold text-rose-600">
                    السعر بعد الخصم:{" "}
                    {calcFinalPrice(
                      form.price,
                      form.discount_value,
                      form.discount_type,
                    )}{" "}
                    EGP
                  </span>
                  <span className="text-sm text-rose-400 mr-auto">
                    توفير{" "}
                    {(
                      parseFloat(form.price) -
                      parseFloat(
                        calcFinalPrice(
                          form.price,
                          form.discount_value,
                          form.discount_type,
                        ),
                      )
                    ).toFixed(2)}{" "}
                    EGP
                  </span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 justify-end bg-gray-50/50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pink-200 transition-all"
              >
                {saving ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <MdCheck className="w-5 h-5" />
                )}
                {editProduct ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">
              تحذف المنتج؟
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              المنتج وصورته هيتحذفوا نهائياً
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
              >
                احذف
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-style {
          width:100%; border:1.5px solid #f3e8ea; border-radius:12px;
          padding:10px 14px; font-size:14px; color:#1f2937;
          background:#fff; outline:none; transition:border-color 0.2s; font-family:inherit;
        }
        .input-style:focus { border-color:#f472b6; box-shadow:0 0 0 3px rgba(244,114,182,0.1); }
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.95) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.25s ease both; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      {children}
    </div>
  );
}
