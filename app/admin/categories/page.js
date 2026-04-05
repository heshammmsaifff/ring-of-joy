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
import { GiDonut } from "react-icons/gi";
import { FiHash } from "react-icons/fi";

const BUCKET = "donuts-images";
const EMPTY_FORM = { name: "", image_url: "" };

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── helpers ──────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toSlug = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");

  // ── data ─────────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  // ── modal ─────────────────────────────────────────
  const openAdd = () => {
    setEditCat(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, image_url: cat.image_url || "" });
    setImageFile(null);
    setImagePreview(cat.image_url || "");
    setModalOpen(true);
  };

  // ── image ─────────────────────────────────────────
  const handleImagePick = (e) => {
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
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressed = await imageCompression(file, options);
      const fileName = `categories/cat-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, compressed);
      if (error) throw error;

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
    if (!form.name.trim()) return showToast("اكتب اسم القسم", "error");
    if (!imageFile && !form.image_url)
      return showToast("ارفع صورة للقسم", "error");

    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        if (editCat?.image_url) await deleteOldImage(editCat.image_url);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        image_url: imageUrl,
        slug: toSlug(form.name),
      };

      const { error } = editCat
        ? await supabase.from("categories").update(payload).eq("id", editCat.id)
        : await supabase.from("categories").insert([payload]);

      if (error) throw error;

      showToast(editCat ? "تم تعديل القسم ✅" : "تم إضافة القسم ✅");
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      showToast("حصل خطأ: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat?.image_url) await deleteOldImage(cat.image_url);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return showToast("مقدرناش نحذف القسم", "error");
    showToast("تم حذف القسم");
    setDeleteId(null);
    fetchCategories();
  };

  // ── render ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl font-bold text-white text-sm ${
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
            <h1 className="text-xl font-black text-gray-800">إدارة الأقسام</h1>
            <p className="text-xs text-gray-400">
              {categories.length} قسم مضاف
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5"
        >
          <MdAdd className="w-5 h-5" />
          إضافة قسم
        </button>
      </div>

      {/* Categories Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-24">
            <GiDonut className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-600 mb-1">
              مفيش أقسام لحد دلوقتي
            </h3>
            <p className="text-gray-400 text-sm mb-6">ابدأ بإضافة أول قسم</p>
            <button
              onClick={openAdd}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              + إضافة قسم
            </button>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-36 bg-pink-50 overflow-hidden relative">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GiDonut className="w-12 h-12 text-pink-200" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between flex-1">
                  <div>
                    <h3 className="font-black text-gray-800">{cat.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FiHash className="w-3 h-3" />
                      {cat.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-2 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">
                {editCat ? "تعديل القسم" : "إضافة قسم جديد"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  صورة القسم *
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
                        className="w-full h-44 object-cover rounded-2xl"
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
                    <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                      <MdCloudUpload className="w-10 h-10 text-pink-300" />
                      <p className="font-bold text-sm text-gray-600">
                        اسحب الصورة هنا أو اضغط للاختيار
                      </p>
                      <p className="text-xs">بيتتحوّل WebP تلقائياً</p>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  اسم القسم *
                </label>
                <input
                  type="text"
                  placeholder="مثال: دونات كلاسيك"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-style"
                />
                {/* Slug preview */}
                {form.name && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 px-1">
                    <FiHash className="w-3 h-3" />
                    {toSlug(form.name)}
                  </p>
                )}
              </div>
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
                {editCat ? "حفظ التعديلات" : "إضافة القسم"}
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
            <h3 className="text-lg font-black text-gray-800 mb-1">
              تحذف القسم؟
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              ممكن يأثر على المنتجات اللي جوّاه
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
