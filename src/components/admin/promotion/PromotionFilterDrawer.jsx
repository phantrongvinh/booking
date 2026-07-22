import { X, SlidersHorizontal, RotateCcw } from "lucide-react";

const inputCls =
  "h-9 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none focus:border-[#FA8C00]";

const discountTypeOptions = [
  { value: "percent", label: "Phần trăm (%)" },
  { value: "amount", label: "Số tiền (đ)" },
];

const statusOptions = [
  { value: "active", label: "Đang chạy" },
  { value: "scheduled", label: "Đã lên lịch" },
  { value: "inactive", label: "Tạm tắt" },
];

const PromotionFilterDrawer = ({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}) => {
  const upd = (patch) => setFilters({ ...filters, ...patch });
  const isPercent = filters.discountType === "percent";
  const isAmount = filters.discountType === "amount";

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
        {/* Header */}
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
          {/* Trạng thái */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Trạng thái
            </label>
            <div className="flex flex-wrap gap-2">
              {[{ value: "all", label: "Tất cả" }, ...statusOptions].map(
                (s) => (
                  <button
                    key={s.value}
                    onClick={() => upd({ status: s.value })}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      filters.status === s.value
                        ? "border-[#FA8C00] bg-[#FA8C00] text-white"
                        : "border-[#FFE7BA] text-[#5B3A0A] hover:bg-[#FFF7E6]"
                    }`}
                  >
                    {s.label}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Loại giảm giá */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Loại giảm giá
            </label>
            <select
              value={filters.discountType}
              onChange={(e) =>
                upd({
                  discountType: e.target.value,
                  minValue: "",
                  maxValue: "",
                })
              }
              className={inputCls}
            >
              <option value="all">Tất cả</option>
              {discountTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Khoảng giảm */}
          {(isPercent || isAmount) && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                {isPercent
                  ? "Khoảng % giảm (0 - 100)"
                  : "Khoảng giá trị giảm (đ)"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  max={isPercent ? 100 : undefined}
                  placeholder="Từ"
                  value={filters.minValue}
                  onChange={(e) => upd({ minValue: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  min={0}
                  max={isPercent ? 100 : undefined}
                  placeholder="Đến"
                  value={filters.maxValue}
                  onChange={(e) => upd({ maxValue: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* Khoảng thời gian */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Khoảng thời gian
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
        </div>

        {/* Footer */}
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

export default PromotionFilterDrawer;
