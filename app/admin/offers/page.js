"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdCheck,
  MdCloudUpload,
} from "react-icons/md";
import { FiPercent, FiEye, FiEyeOff } from "react-icons/fi";
import { GiDonut } from "react-icons/gi";

const BUCKET = "donuts-images";
const EMPTY_FORM = {
  name: "",
  description: "",
  original_price: "",
  final_price: "",
  image_url: "",
  is_active: true,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(""); // blob URL
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  // ── helpers ──────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const discountPct = (ori, fin) => {
    if (!ori || !fin || +ori <= 0) return 0;
    return Math.round(((+ori - +fin) / +ori) * 100);
  };

  // ── data ─────────────────────────────────────────────
  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOffers(data || []);
    setLoading(false);
  };

  // ── modal helpers ────────────────────────────────────
  const openAdd = () => {
    setEditOffer(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  };

  const openEdit = (offer) => {
    setEditOffer(offer);
    setForm({
      name: offer.name,
      description: offer.description || "",
      original_price: offer.original_price,
      final_price: offer.final_price,
      image_url: offer.image_url || "",
      is_active: offer.is_active,
    });
    setImageFile(null);
    setImagePreview(offer.image_url || "");
    setModalOpen(true);
  };

  // ── image pick ───────────────────────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return showToast("الصورة أكبر من 5MB", "error");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024)
      return showToast("الصورة أكبر من 5MB", "error");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── upload to Supabase Storage ───────────────────────
  const uploadImage = async (file) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `offers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setUploading(false);
      throw upErr;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    setUploading(false);
    return data.publicUrl;
  };

  // ── delete old image from storage ────────────────────
  const deleteOldImage = async (url) => {
    if (!url || !url.includes(BUCKET)) return;
    // استخرج المسار من الـ URL
    const path = url.split(`${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  };

  // ── save ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return showToast("اكتب اسم العرض", "error");
    if (!form.original_price) return showToast("اكتب السعر الأصلي", "error");
    if (!form.final_price) return showToast("اكتب سعر بعد الخصم", "error");
    if (+form.final_price >= +form.original_price)
      return showToast("سعر الخصم لازم يكون أقل من الأصلي", "error");

    setSaving(true);
    try {
      let imageUrl = form.image_url;

      // لو فيه صورة جديدة → ارفعها
      if (imageFile) {
        // لو بيعدل وعنده صورة قديمة → احذفها
        if (editOffer?.image_url) await deleteOldImage(editOffer.image_url);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        original_price: +form.original_price,
        final_price: +form.final_price,
        image_url: imageUrl || null,
        is_active: form.is_active,
      };

      const { error } = editOffer
        ? await supabase.from("offers").update(payload).eq("id", editOffer.id)
        : await supabase.from("offers").insert(payload);

      if (error) throw error;

      showToast(editOffer ? "تم تعديل العرض ✅" : "تم إضافة العرض ✅");
      setModalOpen(false);
      fetchOffers();
    } catch (err) {
      console.error(err);
      showToast("حصل خطأ، حاول تاني", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const offer = offers.find((o) => o.id === id);
    if (offer?.image_url) await deleteOldImage(offer.image_url);
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) return showToast("مقدرناش نحذف العرض", "error");
    showToast("تم حذف العرض");
    setDeleteId(null);
    fetchOffers();
  };

  const toggleActive = async (offer) => {
    await supabase
      .from("offers")
      .update({ is_active: !offer.is_active })
      .eq("id", offer.id);
    fetchOffers();
  };

  // ── render ────────────────────────────────────────────
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
            <h1 className="text-xl font-black text-gray-800">إدارة العروض</h1>
            <p className="text-xs text-gray-400">{offers.length} عرض مضاف</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5"
        >
          <MdAdd className="w-5 h-5" />
          إضافة عرض
        </button>
      </div>

      {/* Offers list */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
          </div>
        )}

        {!loading && offers.length === 0 && (
          <div className="text-center py-24">
            <GiDonut className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-600 mb-1">
              مفيش عروض لحد دلوقتي
            </h3>
            <p className="text-gray-400 text-sm mb-6">ابدأ بإضافة أول عرض</p>
            <button
              onClick={openAdd}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              + إضافة عرض
            </button>
          </div>
        )}

        {!loading && offers.length > 0 && (
          <div className="grid gap-4">
            {offers.map((offer) => {
              const disc = discountPct(offer.original_price, offer.final_price);
              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5 shadow-sm transition-all ${offer.is_active ? "border-gray-100" : "border-gray-100 opacity-50"}`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
                    {offer.image_url ? (
                      <img
                        src={offer.image_url}
                        alt={offer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GiDonut className="w-8 h-8 text-pink-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-gray-800">{offer.name}</h3>
                      <span className="bg-rose-100 text-rose-600 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <FiPercent className="w-3 h-3" />
                        {disc}% خصم
                      </span>
                      {!offer.is_active && (
                        <span className="bg-gray-100 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
                          مخفي
                        </span>
                      )}
                    </div>
                    {offer.description && (
                      <p className="text-sm text-gray-400 mt-0.5 truncate">
                        {offer.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-pink-600 font-black text-lg">
                        {offer.final_price} EGP
                      </span>
                      <span className="text-gray-300 text-sm line-through">
                        {offer.original_price} EGP
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(offer)}
                      className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      {offer.is_active ? (
                        <FiEye className="w-4 h-4" />
                      ) : (
                        <FiEyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(offer)}
                      className="p-2 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(offer.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-800">
                {editOffer ? "تعديل العرض" : "إضافة عرض جديد"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* ── Image Upload ── */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  صورة العرض
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${
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
                      {/* Remove button */}
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
                      <p className="text-xs">PNG, JPG, WEBP — حجم أقصى 5MB</p>
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

              {/* اسم العرض */}
              <Field label="اسم العرض *">
                <input
                  type="text"
                  placeholder="مثال: بوكس دوناتس ملكي"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-style"
                />
              </Field>

              {/* الوصف */}
              <Field label="وصف العرض">
                <textarea
                  placeholder="اكتب تفاصيل العرض..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-style resize-none"
                />
              </Field>

              {/* الأسعار */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="السعر الأصلي (EGP) *">
                  <input
                    type="number"
                    placeholder="150"
                    min="0"
                    value={form.original_price}
                    onChange={(e) =>
                      setForm({ ...form, original_price: e.target.value })
                    }
                    className="input-style"
                  />
                </Field>
                <Field label="سعر بعد الخصم (EGP) *">
                  <input
                    type="number"
                    placeholder="99"
                    min="0"
                    value={form.final_price}
                    onChange={(e) =>
                      setForm({ ...form, final_price: e.target.value })
                    }
                    className="input-style"
                  />
                </Field>
              </div>

              {/* Discount preview */}
              {form.original_price &&
                form.final_price &&
                +form.final_price < +form.original_price && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <FiPercent className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold text-rose-600">
                      نسبة الخصم:{" "}
                      {discountPct(+form.original_price, +form.final_price)}%
                    </span>
                    <span className="text-sm text-rose-400 mr-auto">
                      توفير{" "}
                      {(+form.original_price - +form.final_price).toFixed(2)}{" "}
                      EGP
                    </span>
                  </div>
                )}

              {/* Toggle active */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    إظهار العرض للعملاء
                  </p>
                  <p className="text-xs text-gray-400">
                    لو مش محتاج تنشره دلوقتي، اقفله
                  </p>
                </div>
                <button
                  onClick={() =>
                    setForm({ ...form, is_active: !form.is_active })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.is_active ? "bg-pink-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.is_active ? "right-0.5" : "left-0.5"}`}
                  />
                </button>
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
                {editOffer ? "حفظ التعديلات" : "إضافة العرض"}
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
              تحذف العرض؟
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              العرض هيتحذف نهائياً مع صورته
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
