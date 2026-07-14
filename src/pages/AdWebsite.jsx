import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  Save,
  ImagePlus,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import ToastNotification from "@/components/admin/ToastNotification";
import {
  notifySiteSettingsUpdated,
  STORAGE_KEY,
  useSiteSettings,
} from "@/hook/useSettingSite";

const inputCls =
  "w-full rounded-lg border border-[#FFE7BA] px-3 py-2 text-sm text-[#5B3A0A] focus:border-[#FA8C00] focus:outline-none";
const labelCls = "mb-1 block text-xs font-semibold text-[#5B3A0A]";

const AdWebSite = () => {
  const savedSettings = useSiteSettings();
  const [form, setForm] = useState(savedSettings);
  const [toast, setToast] = useState(null);
  const dragIndex = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateSlide = (id, patch) =>
    set(
      "slides",
      form.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );

  const addSlide = () =>
    set("slides", [
      ...form.slides,
      {
        id: Math.max(0, ...form.slides.map((s) => s.id)) + 1,
        title: "Slide mới",
        subtitle: "",
        image: "",
      },
    ]);

  const removeSlide = (id) =>
    set(
      "slides",
      form.slides.filter((s) => s.id !== id),
    );

  const onDrop = (to) => {
    const from = dragIndex.current;
    if (from === null || from === to) return;
    const next = [...form.slides];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    set("slides", next);
    dragIndex.current = null;
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    notifySiteSettingsUpdated();
    setToast({ message: "Đã lưu giao diện trang chủ!", type: "success" });
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#5B3A0A]">
            Quản lý giao diện web
          </h1>
          <p className="text-sm text-gray-500">
            Tùy chỉnh màu sắc, banner và slideshow trang chủ.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#FFE7BA] px-4 py-2.5 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            <ExternalLink className="h-4 w-4" /> Xem trang chủ
          </Link>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA8C00] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e07f00]"
          >
            <Save className="h-4 w-4" /> Lưu
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Colors */}
        <div className="rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-[#5B3A0A]">
            <Palette className="h-5 w-5 text-[#FA8C00]" /> Màu chủ đạo
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Màu thanh trên (Header top)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.headerTopColor}
                  onChange={(e) => set("headerTopColor", e.target.value)}
                  className="h-10 w-12 rounded-lg border border-[#FFE7BA]"
                />
                <input
                  className={inputCls}
                  value={form.headerTopColor}
                  onChange={(e) => set("headerTopColor", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Màu Header</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.headerColor}
                  onChange={(e) => set("headerColor", e.target.value)}
                  className="h-10 w-12 rounded-lg border border-[#FFE7BA]"
                />
                <input
                  className={inputCls}
                  value={form.headerColor}
                  onChange={(e) => set("headerColor", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Màu Footer</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.footerColor}
                  onChange={(e) => set("footerColor", e.target.value)}
                  className="h-10 w-12 rounded-lg border border-[#FFE7BA]"
                />
                <input
                  className={inputCls}
                  value={form.footerColor}
                  onChange={(e) => set("footerColor", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Màu thanh bản quyền (Footer)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.footerCopyrightColor}
                  onChange={(e) => set("footerCopyrightColor", e.target.value)}
                  className="h-10 w-12 rounded-lg border border-[#FFE7BA]"
                />
                <input
                  className={inputCls}
                  value={form.footerCopyrightColor}
                  onChange={(e) => set("footerCopyrightColor", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className={labelCls}>Bảng màu theo mùa (gợi ý)</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Xuân", h: "#FF7EB6", f: "#7A1F4B" },
                { name: "Hạ", h: "#FA8C00", f: "#5B3A0A" },
                { name: "Thu", h: "#C1440E", f: "#5A2A0C" },
                { name: "Đông", h: "#2E7DAF", f: "#12314A" },
                { name: "Giáng sinh", h: "#C0392B", f: "#14532D" },
              ].map((s) => (
                <button
                  key={s.name}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      headerColor: s.h,
                      footerColor: s.f,
                    }))
                  }
                  className="flex items-center gap-2 rounded-lg border border-[#FFE7BA] px-3 py-1.5 text-xs font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
                >
                  <span className="flex gap-0.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: s.h }}
                    />
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: s.f }}
                    />
                  </span>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-[#5B3A0A]">
            <ImagePlus className="h-5 w-5 text-[#FA8C00]" /> Banner trang chủ
          </h2>
          {form.bannerImage && (
            <img
              src={form.bannerImage}
              alt="banner"
              className="mb-3 h-32 w-full rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <div className="space-y-3">
            <input
              className={inputCls}
              value={form.bannerImage}
              onChange={(e) => set("bannerImage", e.target.value)}
              placeholder="URL ảnh banner..."
            />
            <input
              className={inputCls}
              value={form.bannerTitle}
              onChange={(e) => set("bannerTitle", e.target.value)}
              placeholder="Tiêu đề banner"
            />
            <input
              className={inputCls}
              value={form.bannerSubtitle}
              onChange={(e) => set("bannerSubtitle", e.target.value)}
              placeholder="Mô tả banner"
            />
          </div>
        </div>
      </div>

      {/* Slideshow */}
      <div className="mt-5 rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-[#5B3A0A]">
            Slideshow (kéo thả để sắp xếp)
          </h2>
          <button
            onClick={addSlide}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FA8C00] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#e07f00]"
          >
            <Plus className="h-4 w-4" /> Thêm slide
          </button>
        </div>
        <div className="space-y-3">
          {form.slides.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              className="flex flex-col gap-3 rounded-xl border border-[#FFE7BA] bg-[#FFFBF2] p-3 sm:flex-row sm:items-center"
            >
              <div className="flex cursor-grab items-center text-gray-400">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#FFF7E6]">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <input
                  className={inputCls}
                  value={s.title}
                  onChange={(e) => updateSlide(s.id, { title: e.target.value })}
                  placeholder="Tiêu đề"
                />
                <input
                  className={inputCls}
                  value={s.subtitle ?? ""}
                  onChange={(e) =>
                    updateSlide(s.id, { subtitle: e.target.value })
                  }
                  placeholder="Phụ đề"
                />
                <input
                  className={inputCls + " sm:col-span-2"}
                  value={s.image}
                  onChange={(e) => updateSlide(s.id, { image: e.target.value })}
                  placeholder="URL ảnh"
                />
              </div>
              <button
                onClick={() => removeSlide(s.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <ToastNotification
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default AdWebSite;
