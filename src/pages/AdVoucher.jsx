import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Ticket,
  SlidersHorizontal,
} from "lucide-react";

import { useFetch, useSubmit } from "@/hook/customHook";
import { getAllVouchers } from "@/store/slices/voucherSlice";
import {
  formatDiscount,
  currency,
  getExpiryBadge,
  applyScopeOptions,
} from "@/lib/voucherConstants";
import ToastNotification from "@/components/admin/ToastNotification";
import ConfirmDialog from "@/components/ConfirmDialog";
import VoucherModal from "@/components/admin/voucher/VoucherModal";
import VoucherFilterDrawer from "@/components/admin/voucher/VoucherFilterDrawer";
import Pagination from "@/components/Pagination";
import ulti from "@/ultis/ulti";

const PER_PAGE = 8;

const emptyFilters = {
  startDate: "",
  endDate: "",
  discountType: "all",
  minValue: "",
  maxValue: "",
  productId: "all",
};

const AdVoucher = () => {
  const dispatch = useDispatch();

  const fetchVouchersCallback = useCallback(async () => {
    const res = await dispatch(getAllVouchers()).unwrap();
    return { vouchers: res };
  }, [dispatch]);

  const {
    data: { vouchers },
    fetch: reloadVouchers,
    loading: loadingVouchers,
  } = useFetch(fetchVouchersCallback, { initialData: { vouchers: [] } });

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState({ open: false, voucher: null });
  const [del, setDel] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const f = appliedFilters;
    const query = q.toLowerCase();

    return vouchers.filter((v) => {
      const matchSearch =
        !query ||
        v.code.toLowerCase().includes(query) ||
        (v.description ?? "").toLowerCase().includes(query);

      const matchStatus = statusFilter === "all" || v.status === statusFilter;

      let matchDate = true;
      if (f.startDate)
        matchDate = matchDate && new Date(v.endDate) >= new Date(f.startDate);
      if (f.endDate)
        matchDate = matchDate && new Date(v.startDate) <= new Date(f.endDate);

      const matchDiscountType =
        f.discountType === "all" || v.discountType === Number(f.discountType);

      let matchValue = true;
      if (f.minValue)
        matchValue = matchValue && v.discountValue >= Number(f.minValue);
      if (f.maxValue)
        matchValue = matchValue && v.discountValue <= Number(f.maxValue);

      const matchProduct =
        f.productId === "all" ||
        v.applyScope === 0 ||
        (v.productIds ?? []).includes(Number(f.productId));

      return (
        matchSearch &&
        matchStatus &&
        matchDate &&
        matchDiscountType &&
        matchValue &&
        matchProduct
      );
    });
  }, [vouchers, q, statusFilter, appliedFilters]);

  useEffect(() => setPage(1), [q, statusFilter, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (current - 1) * PER_PAGE,
    current * PER_PAGE,
  );

  const handleApplyFilter = () => {
    setAppliedFilters({ ...filters });
    setIsFilterOpen(false);
    setToast({ message: "Đã áp dụng bộ lọc nâng cao.", type: "success" });
  };

  const handleResetFilter = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setIsFilterOpen(false);
    setToast({ message: "Đã đặt lại bộ lọc.", type: "success" });
  };

  const handleSaved = (message) => {
    reloadVouchers();
    setModal({ open: false, voucher: null });
    setToast({ message, type: "success" });
  };

  const handleDeleted = () => {
    reloadVouchers();
    setDel(null);
    setToast({ message: `Đã xóa voucher "${del?.code}".`, type: "success" });
  };

  // TODO: chưa có API xóa voucher - thay throw bằng dispatch(deleteVoucher(id)).unwrap() khi có
  const { submit: removeVoucher, loading: deleting } = useSubmit(
    async (id) => {
      throw new Error("Chưa cấu hình API xóa voucher");
    },
    {
      onSuccess: handleDeleted,
      onError: (err) =>
        setToast({
          message: typeof err === "string" ? err : "Xóa voucher thất bại.",
          type: "error",
        }),
    },
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#5B3A0A]">Quản lý voucher</h1>
          <p className="text-sm text-gray-500">
            {vouchers.length} voucher trong hệ thống.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#FFE7BA] bg-white px-4 py-2.5 text-sm font-semibold text-[#5B3A0A] shadow-sm hover:bg-[#FFF7E6]"
          >
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc nâng cao
          </button>
          <button
            onClick={() => setModal({ open: true, voucher: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA8C00] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e07f00]"
          >
            <Plus className="h-4 w-4" /> Thêm voucher
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm mã hoặc mô tả voucher..."
            className="w-full rounded-xl border border-[#FFE7BA] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#FA8C00] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[42px] rounded-xl border border-[#FFE7BA] bg-white px-3 text-sm focus:border-[#FA8C00] focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm tắt</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FFE7BA] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FFE7BA] bg-[#FFF7E6] text-left text-xs font-semibold text-[#5B3A0A]">
                <th className="px-4 py-3">Mã / Mô tả</th>
                <th className="px-4 py-3">Giảm giá</th>
                <th className="px-4 py-3">Đơn tối thiểu</th>
                <th className="px-4 py-3">Phạm vi áp dụng</th>
                <th className="px-4 py-3">HSD</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loadingVouchers ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-[#FFE7BA] border-t-[#FA8C00]" />
                    Đang tải danh sách voucher...
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    <Ticket className="mx-auto mb-2 h-8 w-8" />
                    Không có voucher nào.
                  </td>
                </tr>
              ) : (
                pageItems.map((v) => {
                  const expiryBadge = getExpiryBadge(v.endDate);
                  const scopeLabel =
                    applyScopeOptions.find((o) => o.value === v.applyScope)
                      ?.label ?? "—";
                  return (
                    <tr
                      key={v.voucherId}
                      className="border-b border-[#FFF3DD] last:border-0 hover:bg-[#FFFBF2]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono font-bold text-[#5B3A0A]">
                          {v.code}
                        </p>
                        <p className="text-xs text-gray-400">{v.description}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#FA8C00]">
                        {formatDiscount(v)}
                        {v.discountType === 0 && v.maxDiscountAmount ? (
                          <p className="text-xs font-normal text-gray-400">
                            Tối đa {currency(v.maxDiscountAmount)}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {currency(v.minOrderValue)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {scopeLabel}
                        {v.applyScope === 1 && (
                          <p className="text-xs text-gray-400">
                            {(v.productIds ?? []).length} sản phẩm
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">
                          {ulti.formatDate(new Date(v.endDate))}
                        </p>
                        {expiryBadge && (
                          <span
                            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${expiryBadge.cls}`}
                          >
                            {expiryBadge.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                            v.status === "active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {v.status === "active" ? "Hoạt động" : "Tạm tắt"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setModal({ open: true, voucher: v })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFE7BA] text-[#5B3A0A] hover:bg-[#FFF7E6]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDel(v)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={current}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

      <VoucherFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />

      <VoucherModal
        open={modal.open}
        voucher={modal.voucher}
        onClose={() => setModal({ open: false, voucher: null })}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!del}
        title="Xóa voucher"
        message={`Bạn có chắc muốn xóa voucher "${del?.code}"?`}
        onConfirm={() => del && removeVoucher(del.voucherId)}
        onClose={() => setDel(null)}
        loading={deleting}
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

export default AdVoucher;
