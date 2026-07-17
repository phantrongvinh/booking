import React, { useState, useEffect, useMemo } from "react";
import VoucherItem from "./VoucherItem";
import voucherAPI from "@/api/voucherAPI";
import { useFetchParams } from "@/hook/customHook";
import { Search, Calendar, RefreshCw, Ticket } from "lucide-react";

const MyVoucher = () => {
  const [activeTab, setActiveTab] = useState("unused"); // "unused" | "used"
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Debounce tìm kiếm mã code
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Thiết lập các tham số để tự động gọi API khi thay đổi
  const fetchParams = useMemo(() => {
    return {
      tab: activeTab,
      search: debouncedSearch,
      from: fromDate,
      to: toDate,
    };
  }, [activeTab, debouncedSearch, fromDate, toDate]);

  // Gọi API tương ứng với các bộ lọc
  const {
    data: vouchersData,
    loading,
  } = useFetchParams(
    async (params) => {
      // 1. Nếu người dùng chọn lọc theo ngày
      if (params.from && params.to) {
        return await voucherAPI.filterVouchers(params.from, params.to);
      }
      // 2. Nếu người dùng đang tìm kiếm theo mã
      if (params.search) {
        return await voucherAPI.searchVouchers(params.search);
      }
      // 3. Mặc định tải theo Tab
      if (params.tab === "used") {
        return await voucherAPI.fetchUsedVouchers();
      }
      return await voucherAPI.fetchUnusedVouchers();
    },
    fetchParams,
    {
      initialData: [],
    }
  );

  const vouchers = useMemo(() => {
    if (!vouchersData || !Array.isArray(vouchersData)) return [];
    return vouchersData;
  }, [vouchersData]);

  // Kiểm tra xem bộ lọc có đang hoạt động hay không
  const isFilterActive = useMemo(() => {
    return !!searchQuery || !!fromDate || !!toDate;
  }, [searchQuery, fromDate, toDate]);

  // Reset toàn bộ bộ lọc
  const handleClearFilters = () => {
    setSearchQuery("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8 px-4">
      {/* --- Tiêu đề trang --- */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF7A00]">
          <Ticket className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#6B4E41]">
            Kho Voucher của tôi
          </h2>
          <p className="text-sm text-gray-500">
            Xem, quản lý và áp dụng mã giảm giá cho các đơn hàng của bạn.
          </p>
        </div>
      </div>

      {/* --- Tabs chuyển đổi --- */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => {
            setActiveTab("unused");
            handleClearFilters();
          }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "unused" && !isFilterActive
              ? "bg-[#FF7A00] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Chưa sử dụng
        </button>
        <button
          onClick={() => {
            setActiveTab("used");
            handleClearFilters();
          }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "used" && !isFilterActive
              ? "bg-[#FF7A00] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Đã sử dụng / Hết hạn
        </button>
      </div>

      {/* --- Thanh tìm kiếm và bộ lọc --- */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-[#FFFDF9] p-4 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Tìm theo code */}
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tìm theo mã code
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập mã voucher (ví dụ: WELCOME20)..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition-all hover:border-orange-300 focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Lọc theo ngày bắt đầu */}
          <div className="w-full md:w-44">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Từ ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-all hover:border-orange-300 focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Lọc theo ngày kết thúc */}
          <div className="w-full md:w-44">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Đến ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-all hover:border-orange-300 focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Nút Xóa bộ lọc */}
          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* --- Trạng thái tải danh sách --- */}
      <div className="relative min-h-[250px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 py-16 backdrop-blur-[1px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF7A00]" />
            <span className="mt-3 text-sm font-medium text-gray-500">
              Đang tải thông tin voucher…
            </span>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-white shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
              <Ticket className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-[#6B4E41]">Không tìm thấy voucher</p>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              {isFilterActive
                ? "Không tìm thấy mã voucher nào khớp với điều kiện tìm kiếm và lọc của bạn. Hãy thử thay đổi bộ lọc."
                : activeTab === "unused"
                  ? "Bạn hiện chưa có voucher nào chưa sử dụng."
                  : "Bạn hiện chưa có voucher nào đã sử dụng hoặc hết hạn."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            {vouchers.map((voucher) => (
              <VoucherItem key={voucher.id} voucher={voucher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVoucher;
