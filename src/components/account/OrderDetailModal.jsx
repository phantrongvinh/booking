import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { X, MapPin, StickyNote, Ban, CheckCircle2 } from "lucide-react";
import { useFetch, useSubmit } from "@/hook/customHook";
import { getOrderById } from "@/store/slices/orderSlice";
import {
  statusStyles,
  statusDot,
  currency,
  cancelReasons,
} from "@/lib/orderConstants";
import ulti from "@/ultis/ulti";
import { cancelMyOrder, confirmMyOrder } from "@/store/slices/userSlice";

const INITIAL_DATA = { order: null };

const OrderDetailModal = ({ orderId, onClose, onActionDone }) => {
  const dispatch = useDispatch();

  const fetchDetailCallback = useCallback(async () => {
    const res = await dispatch(getOrderById(orderId)).unwrap();
    return { order: res.data };
  }, [dispatch, orderId]);

  const {
    data: { order },
    loading,
  } = useFetch(fetchDetailCallback, { initialData: INITIAL_DATA });

  const [actionError, setActionError] = useState("");

  // handel cancel order
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const finalReason =
    selectedReason === "Lý do khác" ? customReason.trim() : selectedReason;

  const canSubmitCancel = finalReason.length > 0;

  const handleConfirmCancel = () => {
    if (!canSubmitCancel) return;
    cancelOrder({ orderId: order.orderId, cancelReasons: finalReason });
  };

  const { submit: cancelOrder, loading: cancelling } = useSubmit(
    async (payload) => {
      await dispatch(
        cancelMyOrder({
          id: payload.orderId,
          cancelReason: payload.cancelReasons,
        }),
      ).unwrap();
    },
    {
      onSuccess: () => onActionDone?.(`Đã hủy đơn hàng #${orderId}.`),
      onError: (err) => {
        const message = typeof err === "string" ? err : "Hủy đơn hàng thất bại";
        onActionDone?.(message, "error");
      },
    },
  );

  // TODO: thay bằng thunk thật khi có
  const { submit: confirmReceived, loading: confirming } = useSubmit(
    async (id) => {
      await dispatch(confirmMyOrder(id)).unwrap();
    },
    {
      onSuccess: () => onActionDone?.(`Đã xác nhận nhận hàng đơn #${orderId}.`),
      onError: (err) => {
        const message =
          typeof err === "string" ? err : "Xác nhận đơn hàng thất bại";
        onActionDone?.(message, "error");
      },
    },
  );

  if (loading || !order) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-white p-10 text-center text-sm text-gray-400 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          Đang tải...
        </div>
      </div>
    );
  }

  // handle tương tác đơn hàng
  const canCancel = order.status === "Chờ xác nhận";
  const canConfirmReceived = order.status === "Đang giao";
  const subtotal = order.items.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4 "
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full max-w-lg  ">
          <div className="flex items-center justify-between border-b border-[#FFE7BA] px-5 py-4">
            <div>
              <p className="font-bold text-[#5B3A0A]">
                Đơn hàng #{order.orderId}
              </p>
              <p className="text-xs text-gray-400">
                {ulti.formatDateTime(new Date(order.createdAt))}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[order.status] ?? ""
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusDot[order.status] ?? ""}`}
              />
              {order.status}
            </span>

            <div className="flex items-start gap-2 rounded-xl bg-[#FFFBF2] p-3 text-sm text-[#5B3A0A]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FA8C00]" />
              <span>{order.shippingAddress}</span>
            </div>
            {order.note && (
              <div className="flex items-start gap-2 rounded-xl bg-[#FFFBF2] p-3 text-sm text-gray-600">
                <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-[#FA8C00]" />
                <span>{order.note}</span>
              </div>
            )}
            {order.cancelReason && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                <Ban className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Lý do hủy: {order.cancelReason}</span>
              </div>
            )}

            <div className="rounded-xl border border-[#FFE7BA]">
              {order.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-[#FFF1D6] px-4 py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#5B3A0A]">
                      {it.productName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {it.sizeName ? `${it.sizeName} · ` : ""}
                      {currency(it.unitPrice)} × {it.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#5B3A0A]">
                    {currency(it.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 rounded-xl bg-[#FFF7E6] p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thanh toán</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-[#FFE7BA] pt-2 text-base font-bold text-[#5B3A0A]">
                <span>Tổng bill</span>
                <span className="text-[#FA8C00]">
                  {currency(order.totalPrice)}
                </span>
              </div>
            </div>

            {actionError && (
              <p className="text-xs font-medium text-rose-600">{actionError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#FFE7BA] px-5 py-4">
            {!showCancelForm && (
              <>
                {order.status === "Đang làm" && (
                  <p className="mr-auto text-xs text-gray-400">
                    Đơn đang chuẩn bị, chưa thể hủy.
                  </p>
                )}
                <button
                  onClick={onClose}
                  className="rounded-xl border border-[#FFE7BA] px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-[#FFF7E6]"
                >
                  Đóng
                </button>
                {canConfirmReceived && (
                  <button
                    onClick={() => confirmReceived(order.orderId)}
                    disabled={confirming}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {confirming ? "Đang xác nhận..." : "Đã nhận hàng"}
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setShowCancelForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600"
                  >
                    <Ban className="h-4 w-4" /> Hủy đơn
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {/* Block chọn lý do hủy đơn */}
        {showCancelForm && (
          <div className=" border border-rose-200 bg-rose-50 p-4">
            <p className="mb-2 text-sm font-semibold text-rose-700">
              Chọn lý do hủy đơn
            </p>
            <div className="space-y-2">
              {cancelReasons.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-rose-500"
                  />
                  {r}
                </label>
              ))}
            </div>

            {selectedReason === "Lý do khác" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do cụ thể..."
                rows={2}
                className="mt-2 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            )}

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCancelForm(false);
                  setSelectedReason("");
                  setCustomReason("");
                }}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!canSubmitCancel || cancelling}
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
