import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Search, Plus, Eye, SlidersHorizontal, RotateCcw } from "lucide-react";

import { useFetch } from "@/hook/customHook";
import { fetchOrder } from "@/store/slices/orderSlice";
import { statusStyles, statusDot, currency } from "@/lib/orderConstants";
import Pagination from "@/components/Pagination";
import ToastNotification from "@/components/admin/ToastNotification";
import OrderFilterDrawer from "@/components/staff/OrderFilterDrawer";
import OrderModal from "@/components/staff/OrderModal";

const emptyFilters = {
  startDate: "",
  endDate: "",
  minPrice: "",
  maxPrice: "",
  paymentMethod: "all",
  status: "all",
};

const StaffOrder = () => {
  const dispatch = useDispatch();

  const {
    data: { orders },
    fetch: reloadList,
    loading,
  } = useFetch(
    async () => {
      const res = await dispatch(fetchOrder()).unwrap();
      return { orders: res.data };
    },
    { initialData: { orders: [] } },
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [toast, setToast] = useState(null);

  const processed = useMemo(() => {
    const f = appliedFilters;
    const q = searchQuery.toLowerCase();

    const result = orders.filter((o) => {
      const matchSearch =
        !q ||
        String(o.orderId).includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.phone || "").includes(searchQuery);
      const matchStatus = f.status === "all" || o.status === f.status;
      const matchPayment =
        f.paymentMethod === "all" || o.paymentMethod === f.paymentMethod;

      let matchDate = true;
      if (f.startDate)
        matchDate = matchDate && new Date(o.createdAt) >= new Date(f.startDate);
      if (f.endDate) {
        const end = new Date(f.endDate);
        end.setHours(23, 59, 59, 999);
        matchDate = matchDate && new Date(o.createdAt) <= end;
      }

      let matchPrice = true;
      if (f.minPrice)
        matchPrice = matchPrice && o.totalPrice >= parseFloat(f.minPrice);
      if (f.maxPrice)
        matchPrice = matchPrice && o.totalPrice <= parseFloat(f.maxPrice);

      return (
        matchSearch && matchStatus && matchPayment && matchDate && matchPrice
      );
    });

    return result.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });
  }, [orders, searchQuery, appliedFilters, sortBy]);

  useEffect(() => setCurrentPage(1), [searchQuery, appliedFilters, sortBy]);

  const totalPages = Math.ceil(processed.length / pageSize) || 1;
  const pageItems = processed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setIsFilterOpen(false);
    setToast({ message: "Đã áp dụng bộ lọc nâng cao.", type: "success" });
  };

  const handleResetDrawer = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setIsFilterOpen(false);
    setToast({ message: "Đã đặt lại bộ lọc.", type: "success" });
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setToast({ message: "Đã đặt lại tìm kiếm & bộ lọc.", type: "success" });
  };

  const openView = (o) => {
    setSelectedOrderId(o.orderId);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedOrderId(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleUpdated = (message, type = "success") => {
    if (type === "success") {
      reloadList();
    }
    setToast({ message, type });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#5B3A0A]">
            Danh sách Đơn hàng
          </h1>
          <p className="text-sm text-gray-500">
            Theo dõi, xử lý đơn đặt hàng tại quầy và đơn hàng giao online.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#FFE7BA] bg-white px-4 py-2 text-sm font-semibold text-[#5B3A0A] shadow-sm transition-all hover:bg-[#FFF7E6]"
          >
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E07E00]"
          >
            <Plus className="h-4 w-4" /> Tạo đơn hàng mới
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FFE7BA] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FFE7BA] p-4">
          <h2 className="font-bold text-[#5B3A0A]">Tất cả đơn hàng</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách..."
                className="h-9 w-56 rounded-lg border border-[#FFE7BA] bg-white pl-8 pr-3 text-xs outline-none focus:border-[#FA8C00]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-[#FFE7BA] bg-white px-3 text-xs outline-none focus:border-[#FA8C00]"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
            <button
              onClick={handleResetSearch}
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
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Ngày đặt</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#FFE7BA] animate-pulse"
                  >
                    <td className="px-4 py-3">
                      <div className="h-4 w-12 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3 space-y-1.5">
                      <div className="h-3.5 w-28 rounded bg-[#FFE7BA]" />
                      <div className="h-3 w-20 rounded bg-[#FFE7BA]/60" />
                    </td>
                    <td className="px-4 py-3 space-y-1.5">
                      <div className="h-3.5 w-20 rounded bg-[#FFE7BA]" />
                      <div className="h-3 w-14 rounded bg-[#FFE7BA]/60" />
                    </td>
                    <td className="px-4 py-3 flex justify-end">
                      <div className="h-4 w-16 rounded bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-24 rounded-full bg-[#FFE7BA]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="mx-auto h-8 w-8 rounded-lg bg-[#FFE7BA]" />
                    </td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                pageItems.map((o) => (
                  <tr
                    key={o.orderId}
                    onClick={() => openView(o)}
                    className="cursor-pointer border-t border-[#FFE7BA] transition-colors hover:bg-[#FFF8E8]/60"
                  >
                    <td className="px-4 py-3 font-semibold text-[#FA8C00]">
                      #{o.orderId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#5B3A0A]">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-gray-400">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#5B3A0A]">
                        {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(o.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#5B3A0A]">
                      {currency(o.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[o.status] ?? "border-gray-200 bg-gray-50 text-gray-500"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusDot[o.status] ?? "bg-gray-400"}`}
                        />
                        {o.status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => openView(o)}
                          title="Xem chi tiết"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all hover:border-[#FA8C00] hover:text-[#FA8C00]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
          totalItems={processed.length}
          pageSize={pageSize}
        />
      </div>

      <OrderFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApply}
        onReset={handleResetDrawer}
      />

      <OrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        orderId={selectedOrderId}
        onUpdated={handleUpdated}
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

export default StaffOrder;
