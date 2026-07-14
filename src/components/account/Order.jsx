import { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Eye, Ban, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useFetch } from "@/hook/customHook";
import { fetchMyOrders } from "@/store/slices/userSlice";
import {
  statusStyles,
  statusDot,
  currency,
  allStatusLabels,
} from "@/lib/orderConstants";
import Pagination from "../Pagination";
import OrderDetailModal from "./OrderDetailModal";
import ToastNotification from "../admin/ToastNotification";

const PER_PAGE = 3;
const INITIAL_DATA = { orders: [] };

const MyOrdersPage = () => {
  const dispatch = useDispatch();

  const fetchOrdersCallback = useCallback(async () => {
    const res = await dispatch(fetchMyOrders()).unwrap();
    return { orders: res.data };
  }, [dispatch]);

  const {
    data: { orders },
    fetch: reloadOrders,
  } = useFetch(fetchOrdersCallback, { initialData: INITIAL_DATA });

  const [filter, setFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toast, setToast] = useState(null);

  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  );

  const filtered = useMemo(
    () =>
      filter === "Tất cả" ? sorted : sorted.filter((o) => o.status === filter),
    [sorted, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (current - 1) * PER_PAGE,
    current * PER_PAGE,
  );

  const handleActionDone = (message, type = "success") => {
    if (type === "success") {
      reloadOrders();
      setSelectedOrderId(null);
    }

    setToast({ message, type });
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">Đơn hàng của tôi</h1>
        <p className="text-sm text-gray-500">
          Xem chi tiết và quản lý các đơn hàng của bạn.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Tất cả", ...allStatusLabels].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
              filter === f
                ? "bg-[#FA8C00] text-white"
                : "border border-[#FFE7BA] bg-white text-[#5B3A0A] hover:bg-[#FFF7E6]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FFE7BA] bg-white shadow-sm">
        {pageItems.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ShoppingBag className="mb-2 h-10 w-10" />
            <p className="text-sm">Không có đơn hàng nào.</p>
          </div>
        )}
        {pageItems.map((o) => {
          const canCancel = o.status === "Chờ xác nhận";
          const canConfirmReceived = o.status === "Đang giao";
          return (
            <div
              key={o.orderId}
              className="flex flex-wrap items-center gap-3 border-b border-[#FFF1D6] px-4 py-4 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#5B3A0A]">#{o.orderId}</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      statusStyles[o.status] ?? ""
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDot[o.status] ?? ""}`}
                    />
                    {o.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {o.totalItems} sản phẩm ·{" "}
                  {new Date(o.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <p className="font-bold text-[#FA8C00]">
                {currency(o.totalPrice)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrderId(o.orderId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-3 py-1.5 text-xs font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
                >
                  <Eye className="h-3.5 w-3.5" /> Chi tiết
                </button>
                {canConfirmReceived && (
                  <button
                    onClick={() => setSelectedOrderId(o.orderId)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Đã nhận hàng
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setSelectedOrderId(o.orderId)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    <Ban className="h-3.5 w-3.5" /> Hủy
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <Pagination
          currentPage={current}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={orders.length}
          pageSize={PER_PAGE}
        />
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onActionDone={handleActionDone}
        />
      )}

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

export default MyOrdersPage;
