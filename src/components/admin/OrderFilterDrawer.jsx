import React from "react";
import { X, Calendar, DollarSign, CreditCard, Layers } from "lucide-react";

const OrderFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectStatus = (status) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Chờ xác nhận", label: "Chờ xác nhận" },
    { value: "Đang giao", label: "Đang giao" },
    { value: "Đã giao", label: "Đã giao" },
    { value: "Đã hủy", label: "Đã hủy" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9990] flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md border-l border-border bg-card p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <h2 className="text-xl font-bold text-[#5B3A0A]">Bộ lọc nâng cao</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 1. Date Range */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A] mb-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Khoảng ngày đặt
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block mb-0.5">Từ ngày</span>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00] focus:bg-[#FFF3D6]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block mb-0.5">Đến ngày</span>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00] focus:bg-[#FFF3D6]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Price Range */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A] mb-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                Tổng tiền (VND)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 block mb-0.5">Tối thiểu</span>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={handleChange}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00] focus:bg-[#FFF3D6]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block mb-0.5">Tối đa</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="99.000.000"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00] focus:bg-[#FFF3D6]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A] mb-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleChange}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-[#FA8C00] focus:bg-[#FFF3D6]"
              >
                <option value="all">Tất cả phương thức</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Momo">Momo</option>
                <option value="ZaloPay">ZaloPay</option>
              </select>
            </div>

            {/* 4. Status Checkbox Group */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A] mb-2">
                <Layers className="h-4 w-4 text-gray-400" />
                Trạng thái đơn hàng
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectStatus(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      filters.status === opt.value
                        ? "bg-[#FA8C00] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Footer */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 h-10 rounded-lg border border-border bg-background text-sm font-semibold text-gray-600 hover:bg-muted transition-colors cursor-pointer"
          >
            Đặt lại
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 h-10 rounded-lg bg-[#FA8C00] text-sm font-bold text-white hover:bg-[#D97706] transition-colors shadow-md cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilterDrawer;
