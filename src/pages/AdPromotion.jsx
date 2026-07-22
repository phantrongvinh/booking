import { useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  BadgePercent,
  Pencil,
  Trash2,
  SlidersHorizontal,
  FileUp,
} from "lucide-react";
import {
  getPromotion,
  deletePromotion,
  importPromotion,
} from "@/store/slices/promotionSlice";
import { useFetch, useSubmit } from "@/hook/customHook";
import ToastNotification from "@/components/admin/ToastNotification";
import PromotionModal from "@/components/admin/promotion/PromotionModal";
import PromotionFilterDrawer from "@/components/admin/promotion/PromotionFilterDrawer";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS = {
  status: "all",
  discountType: "all",
  minValue: "",
  maxValue: "",
  startDate: "",
  endDate: "",
};

const statusBadge = (p) => {
  if (p.isOngoing) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (p.status === "active")
    return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-gray-200 bg-gray-50 text-gray-500";
};

const statusLabel = (p) => {
  if (p.isOngoing) return "Đang chạy";
  if (p.status === "active") return "Đã lên lịch";
  return "Tạm tắt";
};

const AdPromotion = () => {
  const dispatch = useDispatch();
  const { promotions = [] } = useSelector((state) => state.promotion);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [del, setDel] = useState(null);
  const [modal, setModal] = useState({ open: false, promotion: null });
  const [toast, setToast] = useState(null);
  const importRef = useRef(null);

  // Fetch list
  const { fetch: reloadList } = useFetch(
    () => dispatch(getPromotion()).unwrap(),
    { immediate: true },
  );

  // Delete
  const { submit: remove } = useSubmit(
    (id) => dispatch(deletePromotion(id)).unwrap(),
    {
      onSuccess: () => {
        setDel(null);
        setToast({ message: "Đã xóa khuyến mãi.", type: "success" });
      },
      onError: (err) =>
        setToast({
          message: typeof err === "string" ? err : "Xóa thất bại.",
          type: "error",
        }),
    },
  );

  // Import Excel
  const { submit: doImport, loading: importing } = useSubmit(
    (formData) => dispatch(importPromotion(formData)).unwrap(),
    {
      onSuccess: () => {
        setToast({ message: "Import thành công!", type: "success" });
        reloadList();
      },
      onError: (err) =>
        setToast({
          message: typeof err === "string" ? err : "Import thất bại.",
          type: "error",
        }),
    },
  );

  const handleImportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    doImport(formData);
    e.target.value = ""; // reset input
  };

  // Filter + search
  const filtered = useMemo(() => {
    return promotions.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (appliedFilters.status !== "all") {
        if (appliedFilters.status === "active" && !p.isOngoing) return false;
        if (
          appliedFilters.status === "scheduled" &&
          (p.isOngoing || p.status !== "active")
        )
          return false;
        if (appliedFilters.status === "inactive" && p.status !== "inactive")
          return false;
      }
      if (
        appliedFilters.discountType !== "all" &&
        p.discountType !== appliedFilters.discountType
      )
        return false;
      if (
        appliedFilters.minValue !== "" &&
        p.discountValue < Number(appliedFilters.minValue)
      )
        return false;
      if (
        appliedFilters.maxValue !== "" &&
        p.discountValue > Number(appliedFilters.maxValue)
      )
        return false;
      if (
        appliedFilters.startDate &&
        new Date(p.startDate) < new Date(appliedFilters.startDate)
      )
        return false;
      if (
        appliedFilters.endDate &&
        new Date(p.endDate) > new Date(appliedFilters.endDate)
      )
        return false;
      return true;
    });
  }, [promotions, q, appliedFilters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApply = () => {
    setAppliedFilters(filters);
    setPage(1);
    setDrawerOpen(false);
    setToast({ message: "Đã áp dụng bộ lọc nâng cao.", type: "success" });
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
    setDrawerOpen(false);
    setToast({ message: "Đã đặt lại bộ lọc.", type: "success" });
  };

  const activeFilterCount = Object.entries(appliedFilters).filter(
    ([k, v]) => v !== DEFAULT_FILTERS[k],
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#5B3A0A]">
            Quản lý khuyến mãi
          </h1>
          <p className="text-sm text-gray-500">
            {filtered.length} chương trình khuyến mãi.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Import Excel */}
          <button
            onClick={() => importRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-xl border border-[#FFE7BA] bg-white px-4 py-2.5 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6] disabled:opacity-50"
          >
            <FileUp className="h-4 w-4 text-[#FA8C00]" />
            {importing ? "Đang import..." : "Import Excel"}
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportChange}
          />
          {/* Tạo mới */}
          <button
            onClick={() => setModal({ open: true, promotion: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA8C00] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e07f00]"
          >
            <Plus className="h-4 w-4" /> Tạo khuyến mãi
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm chương trình..."
            className="w-full rounded-xl border border-[#FFE7BA] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#FA8C00] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-xl border border-[#FFE7BA] bg-white px-4 py-2.5 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#FA8C00]" /> Bộ lọc
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FA8C00] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[#FFE7BA] bg-white py-16 text-gray-400 shadow-sm">
          <BadgePercent className="mb-2 h-10 w-10" />
          <p className="text-sm">Chưa có chương trình khuyến mãi nào.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pageItems.map((p) => (
            <div
              key={p.promotionId}
              className="rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm"
            >
              {p.bannerUrl && (
                <img
                  src={p.bannerUrl}
                  alt={p.title}
                  className="mb-3 h-32 w-full rounded-xl object-cover"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#5B3A0A]">{p.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-[#FA8C00]">
                    Giảm{" "}
                    {p.discountType === "percent"
                      ? `${p.discountValue}%`
                      : `${p.discountValue.toLocaleString("vi-VN")}đ`}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(p)}`}
                >
                  {statusLabel(p)}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(p.startDate).toLocaleDateString("vi-VN")} →{" "}
                {new Date(p.endDate).toLocaleDateString("vi-VN")}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {p.productCount} sản phẩm áp dụng
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setModal({ open: true, promotion: p })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-3 py-1.5 text-xs font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Sửa
                </button>
                <button
                  onClick={() => setDel(p)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-2 rounded-2xl border border-[#FFE7BA] bg-white">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      )}

      {/* Filter Drawer */}
      <PromotionFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApply}
        onReset={handleReset}
      />

      {/* Modal */}
      <PromotionModal
        open={modal.open}
        promotion={modal.promotion}
        onClose={() => setModal({ open: false, promotion: null })}
        onSaved={(msg) => {
          setModal({ open: false, promotion: null });
          setToast({ message: msg, type: "success" });
          reloadList();
        }}
      />

      {/* Confirm Delete */}
      {del && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-bold text-[#5B3A0A]">Xóa khuyến mãi</h3>
            <p className="mt-2 text-sm text-gray-500">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold">"{del.title}"</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDel(null)}
                className="rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
              >
                Hủy
              </button>
              <button
                onClick={() => remove(del.promotionId)}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <ToastNotification
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdPromotion;
