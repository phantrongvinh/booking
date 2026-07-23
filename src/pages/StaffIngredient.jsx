import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Search,
  RotateCcw,
  ClipboardCheck,
  AlertTriangle,
  Wheat,
  PackageX,
} from "lucide-react";
import { useFetch } from "@/hook/customHook";
import { fetchAllIngredient } from "@/store/slices/ingredientSlice";
import StatCard from "@/components/staff/StatCard";
import IngredientModal from "@/components/staff/IngredientModal";
import Pagination from "@/components/Pagination";
import ToastNotification from "@/components/admin/ToastNotification";
import {
  getTodayCheckCount,
  incrementTodayCheckCount,
  isUpdatedToday,
} from "@/lib/ingredientCheckHelper";

const LOW_STOCK = 10;

const inputCls =
  "h-9 rounded-lg border border-[#FFE7BA] bg-white px-3 text-xs outline-none focus:border-[#FA8C00]";

// handle tính toán số lượng nguyên liệu
const getIngredientLevel = (currentStock) => {
  if (currentStock <= 0) return "out";
  if (currentStock <= LOW_STOCK) return "low";
  return "ok";
};

// fetch ingredients
const StaffIngredient = () => {
  const dispatch = useDispatch();

  const {
    data: { ingredients },
    fetch: reloadList,
    loading,
  } = useFetch(
    async () => {
      const ingredients = await dispatch(fetchAllIngredient()).unwrap();
      return { ingredients };
    },
    { initialData: { ingredients: [] } },
  );

  // handle filter và search
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ingredients.filter((i) => {
      const ms = !q || i.name.toLowerCase().includes(q);
      const ml =
        levelFilter === "all" ||
        getIngredientLevel(i.currentStock) === levelFilter;
      return ms && ml;
    });
  }, [ingredients, search, levelFilter]);

  // pagination
  useEffect(() => setPage(1), [search, levelFilter]);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const lowCount = ingredients.filter(
    (i) => getIngredientLevel(i.currentStock) === "low",
  ).length;
  const outCount = ingredients.filter(
    (i) => getIngredientLevel(i.currentStock) === "out",
  ).length;

  const openCount = (i) => {
    setSelected(i);
    setModalOpen(true);
  };

  const handleSaved = () => {
    if (selected) {
      incrementTodayCheckCount(selected.ingredientId);
    }
    reloadList();
    setModalOpen(false);
    setToast({ message: "Đã cập nhật kiểm kê nguyên liệu.", type: "success" });
  };

  const resetAll = () => {
    setSearch("");
    setLevelFilter("all");
    reloadList();
    setToast({ message: "Đã đặt lại bộ lọc & tìm kiếm", type: "success" });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">Kho Nguyên liệu</h1>
        <p className="text-sm text-gray-500">
          Theo dõi tồn kho, cảnh báo sắp hết và kiểm kê hao hụt.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng nguyên liệu"
          value={ingredients.length}
          icon={Wheat}
          tone="brand"
        />
        <StatCard
          label="Sắp hết"
          value={lowCount}
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          label="Hết hàng"
          value={outCount}
          icon={PackageX}
          tone="rose"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FFE7BA] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FFE7BA] p-4">
          <h2 className="font-bold text-[#5B3A0A]">Danh sách nguyên liệu</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm nguyên liệu..."
                className="h-9 w-48 rounded-lg border border-[#FFE7BA] bg-white pl-8 pr-3 text-xs outline-none focus:border-[#FA8C00]"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={inputCls}
            >
              <option value="all">Mọi trạng thái</option>
              <option value="ok">Đủ hàng</option>
              <option value="low">Sắp hết</option>
              <option value="out">Hết hàng</option>
            </select>
            <button
              onClick={resetAll}
              title="Đặt lại"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#FFE7BA] text-gray-500 hover:bg-[#FFF7E6]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7E6] text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Nguyên liệu</th>
                <th className="px-4 py-3 text-left">Đơn vị</th>
                <th className="px-4 py-3 text-right">Tồn kho</th>
                <th className="px-4 py-3 text-right">Đơn giá</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>

                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-[#FFE7BA] animate-pulse"
                  >
                    <td className="px-4 py-3">
                      <div className="h-4 w-28 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-10 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3 flex justify-end">
                      <div className="h-4 w-16 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3 flex justify-end">
                      <div className="h-4 w-20 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-16 rounded-full bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="mx-auto h-4 w-24 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3 flex justify-end">
                      <div className="h-7 w-20 rounded-lg bg-[#FFE7BA]" />
                    </td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    Không tìm thấy nguyên liệu nào.
                  </td>
                </tr>
              ) : (
                pageItems.map((i) => {
                  const level = getIngredientLevel(i.currentStock);
                  const badge = {
                    ok: {
                      t: "Đủ hàng",
                      c: "border-emerald-200 bg-emerald-50 text-emerald-700",
                    },
                    low: {
                      t: "Sắp hết",
                      c: "border-amber-200 bg-amber-50 text-amber-700",
                    },
                    out: {
                      t: "Hết hàng",
                      c: "border-rose-200 bg-rose-50 text-rose-700",
                    },
                  }[level];
                  return (
                    <tr
                      key={i.ingredientId}
                      className="border-t border-[#FFE7BA] transition-colors hover:bg-[#FFF8E8]/60"
                    >
                      <td className="px-4 py-3 font-medium text-[#5B3A0A]">
                        {i.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{i.unit}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#5B3A0A]">
                        {i.currentStock} {i.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {i.costPerUnit.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.c}`}
                        >
                          {badge.t}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-[#5B3A0A]">
                        <div>
                          <p>{i.name}</p>
                          {isUpdatedToday(i.updatedAt) && (
                            <div className="mt-1 flex items-center justify-center gap-1">
                              <ClipboardCheck className="h-3 w-3 text-blue-500" />
                              <span className="text-[10px] font-medium text-blue-600">
                                Đã kiểm kê hôm nay
                                {getTodayCheckCount(i.ingredientId) > 1 &&
                                  ` (${getTodayCheckCount(i.ingredientId)} lần)`}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          onClick={() => openCount(i)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-3 py-1.5 text-xs font-semibold text-[#5B3A0A] transition-all hover:border-[#FA8C00] hover:text-[#FA8C00]"
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" /> Kiểm kê
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={filtered.length}
          pageSize={pageSize}
        />
      </div>

      <IngredientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ingredient={selected}
        onSaved={handleSaved}
      />

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

export default StaffIngredient;
