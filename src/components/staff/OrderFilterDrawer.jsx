import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { allStatusLabels, paymentMethods } from "@/lib/orderConstants";

const inputCls =
  "h-9 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none focus:border-[#FA8C00]";

const OrderFilterDrawer = ({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}) => {
  const upd = (patch) => setFilters({ ...filters, ...patch });

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[90vw] flex-col bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-[#5B3A0A]">
            <SlidersHorizontal className="h-4 w-4 text-[#FA8C00]" /> Bộ lọc nâng
            cao
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Khoảng ngày đặt
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => upd({ startDate: e.target.value })}
                className={inputCls}
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => upd({ endDate: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Khoảng tổng tiền (đ)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                placeholder="Từ"
                value={filters.minPrice}
                onChange={(e) => upd({ minPrice: e.target.value })}
                className={inputCls}
              />
              <input
                type="number"
                min={0}
                placeholder="Đến"
                value={filters.maxPrice}
                onChange={(e) => upd({ maxPrice: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Phương thức thanh toán
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => upd({ paymentMethod: e.target.value })}
              className={inputCls}
            >
              <option value="all">Tất cả</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Trạng thái đơn hàng
            </label>
            <select
              value={filters.status}
              onChange={(e) => upd({ status: e.target.value })}
              className={inputCls}
            >
              <option value="all">Tất cả</option>
              {allStatusLabels.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#FFE7BA] p-4">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            <RotateCcw className="h-4 w-4" /> Đặt lại
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E07E00]"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </aside>
    </>
  );
};

export default OrderFilterDrawer;
