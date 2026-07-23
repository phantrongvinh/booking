import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { X, Plus, Trash2, User, Package, Printer } from "lucide-react";
import { useFetch, useSubmit } from "@/hook/customHook";
import { getOrderById, updateOrderStatus } from "@/store/slices/orderSlice";
import { fetchAllProduct } from "@/store/slices/productSlice";
import {
  statusOptions,
  statusStyles,
  statusDot,
  currency,
} from "@/lib/orderConstants";
import { fetchUsers } from "@/store/slices/userSlice";
import ulti from "@/ultis/ulti";

const inputCls =
  "h-9 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none focus:border-[#FA8C00]";

const OrderModal = ({ open, onClose, mode, orderId, onUpdated }) => {
  const dispatch = useDispatch();

  // handle fetch order theo id
  const {
    data: { order } = {},
    loading: orderLoading,
    fetch: reloadOrder,
  } = useFetch(
    async () => {
      if (!orderId) return { order: null };
      const res = await dispatch(getOrderById(orderId)).unwrap();

      return { order: res.data };
    },
    { initialData: { order: null } },
  );

  useEffect(() => {
    if (open && mode === "view" && orderId) {
      reloadOrder();
    }
  }, [open, mode, orderId]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");

  // submit trạng thái order
  const { submit: updateStatus, loading: updating } = useSubmit(
    async ({ orderId, newStatus, note }) => {
      const res = await dispatch(
        updateOrderStatus({ orderId, newStatus, note }),
      ).unwrap();
    },
    {
      onSuccess: () => {
        setNote("");
        setSelectedStatus("");
        reloadOrder();
        onUpdated?.("Đã cập nhật trạng thái đơn hàng.");
      },
      onError: (err) => {
        const message =
          typeof err === "string" ? err : "Cập nhật trạng thái thất bại.";
        onUpdated?.(message, "error");
      },
    },
  );

  const handleSubmitStatus = () => {
    if (!selectedStatus || !order) return;
    updateStatus({
      orderId: order.orderId,
      newStatus: Number(selectedStatus),
      note,
    });
  };

  // handle tạo đơn mới
  const {
    data: { customers, products },
  } = useFetch(
    async () => {
      const [userRes, productRes] = await Promise.allSettled([
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchAllProduct()).unwrap(),
      ]);

      return {
        customers:
          userRes.status === "fulfilled"
            ? userRes.value.filter((u) => u.roleId === 3)
            : [],
        products: productRes.status === "fulfilled" ? productRes.value : [],
      };
    },
    { initialData: { customers: [], products: [] } },
  );

  const [customerId, setCustomerId] = useState("");
  const [info, setInfo] = useState({ phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [createNote, setCreateNote] = useState("");
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setCustomerId("");
      setInfo({ phone: "", address: "" });
      setPaymentMethod("COD");
      setCreateNote("");
      setLines([]);
    }
  }, [open, mode]);

  const total = lines.reduce((s, l) => s + l.totalPrice, 0);

  const addLine = () => {
    const p = products[0];
    if (!p) return;
    setLines((prev) => [
      ...prev,
      {
        productId: p.productId,
        productName: p.name,
        quantity: 1,
        unitPrice: p.salePrice ?? p.price,
        totalPrice: p.salePrice ?? p.price,
      },
    ]);
  };

  const updateLine = (idx, patch) => {
    setLines((prev) =>
      prev.map((l, i) => {
        if (i !== idx) return l;
        const next = { ...l, ...patch };
        if (patch.productId != null) {
          const p = products.find((x) => x.productId === patch.productId);
          if (p) {
            next.productName = p.name;
            next.unitPrice = p.salePrice ?? p.price;
          }
        }
        next.totalPrice = next.unitPrice * next.quantity;
        return next;
      }),
    );
  };

  const removeLine = (idx) =>
    setLines((prev) => prev.filter((_, i) => i !== idx));

  const { submit: submitCreate, loading: creating } = useSubmit(
    async (payload) => {
      console.log(payload);

      // await dispatch(createOrder(payload)).unwrap();
    },
    {
      onSuccess: () => onUpdated?.("Tạo đơn hàng thành công."),
    },
  );

  const onPickCustomer = (id) => {
    setCustomerId(id);
    const c = customers.find((x) => String(x.userId) === id);
    if (c) {
      setInfo((prev) => ({ ...prev, phone: c.phone || "" }));
    }
  };

  const handleCreate = () => {
    if (!customerId || lines.length === 0) return;
    submitCreate({
      userId: Number(customerId),
      phone: info.phone,
      shippingAddress: info.address,
      paymentMethod,
      note: createNote,
      items: lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
      })),
    });
  };

  const lastHistoryStatus =
    order?.statusHistory?.[order.statusHistory.length - 1]?.status;

  const isCompleted =
    lastHistoryStatus === "Hoàn thành" || lastHistoryStatus === "Đã hủy";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-6 py-4">
          <h3 className="text-lg font-bold text-[#5B3A0A]">
            {mode === "view"
              ? `Chi tiết đơn hàng #${orderId ?? ""}`
              : "Tạo đơn hàng mới"}
          </h3>
          <div className="flex items-center gap-2">
            {mode === "view" && order && (
              <button
                onClick={() => window.print()}
                title="In hóa đơn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFE7BA] text-gray-500 hover:border-[#FA8C00] hover:text-[#FA8C00]"
              >
                <Printer className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {mode === "view" ? (
            orderLoading || !order ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Đang tải...
              </p>
            ) : (
              <>
                <div id="invoice-print-area">
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#FFF7E6] p-4 text-sm">
                    <Field label="Khách hàng" value={order.customerName} />
                    <Field label="Số điện thoại" value={order.phone} />
                    <Field
                      label="Ngày đặt"
                      value={ulti.formatDateTime(new Date(order.createdAt))}
                    />
                    <Field label="Thanh toán" value={order.paymentMethod} />
                    <Field
                      label="Địa chỉ giao"
                      value={order.shippingAddress}
                      full
                    />
                    {order.note && (
                      <Field label="Ghi chú" value={order.note} full />
                    )}
                    {order.cancelReason && (
                      <Field
                        label="Lý do hủy"
                        value={order.cancelReason}
                        full
                      />
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#5B3A0A]">
                      Sản phẩm
                    </p>
                    <div className="overflow-hidden rounded-xl border border-[#FFE7BA]">
                      <table className="w-full text-sm">
                        <thead className="bg-[#FFF7E6] text-xs text-gray-500">
                          <tr>
                            <th className="px-3 py-2 text-left">Tên</th>
                            <th className="px-3 py-2 text-center">Size</th>
                            <th className="px-3 py-2 text-center">SL</th>
                            <th className="px-3 py-2 text-right">Đơn giá</th>
                            <th className="px-3 py-2 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((it, i) => (
                            <tr key={i} className="border-t border-[#FFE7BA]">
                              <td className="px-3 py-2">{it.productName}</td>
                              <td className="px-3 py-2 text-center text-gray-500">
                                {it.sizeName || "—"}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {it.quantity}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {currency(it.unitPrice)}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold">
                                {currency(it.totalPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 flex justify-end text-base font-bold text-[#5B3A0A]">
                      Tổng cộng:{" "}
                      <span className="ml-2 text-[#FA8C00]">
                        {currency(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-[#5B3A0A]">
                    Lịch sử trạng thái
                  </p>
                  <div className="space-y-2">
                    {order.statusHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between rounded-lg border border-[#FFE7BA] px-3 py-2 text-xs"
                      >
                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-semibold ${
                              statusStyles[h.status] ?? ""
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusDot[h.status] ?? ""}`}
                            />
                            {h.status}
                          </span>
                          {h.note && (
                            <p className="mt-1 text-gray-500">{h.note}</p>
                          )}
                        </div>
                        <div className="text-right text-gray-400">
                          <p>{new Date(h.changedAt).toLocaleString("vi-VN")}</p>
                          <p>{h.changedByUserName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-[#5B3A0A]">
                    Cập nhật trạng thái
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSelectedStatus(s.value)}
                        disabled={isCompleted}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedStatus === s.value
                            ? (statusStyles[s.label] ?? "") +
                              " ring-2 ring-[#FA8C00]/40"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        } ${isCompleted ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusDot[s.label] ?? ""}`}
                        />
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú khi đổi trạng thái (không bắt buộc)"
                    rows={2}
                    disabled={isCompleted}
                    className="mt-2 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 py-2 text-sm outline-none focus:border-[#FA8C00] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {isCompleted && (
                    <p
                      className={`mt-1.5 text-xs  text-right ${lastHistoryStatus === "Hoàn thành" ? "text-green-400" : "text-red-400"} `}
                    >
                      Đơn hàng đã {lastHistoryStatus.toLowerCase()}, không thể
                      thay đổi trạng thái.
                    </p>
                  )}
                </div>
              </>
            )
          ) : (
            <>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A]">
                  <User className="h-4 w-4 text-[#FA8C00]" /> Thông tin khách
                  hàng
                </p>
                <select
                  value={customerId}
                  onChange={(e) => onPickCustomer(e.target.value)}
                  className={inputCls}
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map((c) => (
                    <option key={c.userId} value={c.userId}>
                      {c.username} · {c.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Số điện thoại giao *"
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className={inputCls}
                />
                <input
                  placeholder="Địa chỉ giao *"
                  value={info.address}
                  onChange={(e) =>
                    setInfo({ ...info, address: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-[#5B3A0A]">
                    <Package className="h-4 w-4 text-[#FA8C00]" /> Sản phẩm
                  </p>
                  <button
                    onClick={addLine}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#FFF2DC] px-2.5 py-1.5 text-xs font-semibold text-[#FA8C00] hover:bg-[#FFE7BA]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm sản phẩm
                  </button>
                </div>
                {lines.length === 0 && (
                  <p className="rounded-lg border border-dashed border-[#FFE7BA] py-4 text-center text-xs text-gray-400">
                    Chưa có sản phẩm nào.
                  </p>
                )}
                <div className="space-y-2">
                  {lines.map((l, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center gap-2 rounded-lg border border-[#FFE7BA] p-2"
                    >
                      <select
                        value={l.productId}
                        onChange={(e) =>
                          updateLine(idx, { productId: Number(e.target.value) })
                        }
                        className={inputCls + " col-span-5"}
                      >
                        {products.map((p) => (
                          <option key={p.productId} value={p.productId}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={l.quantity}
                        onChange={(e) =>
                          updateLine(idx, {
                            quantity: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className={inputCls + " col-span-3 text-center"}
                      />
                      <div className="col-span-3 text-right text-sm font-semibold text-[#5B3A0A]">
                        {currency(l.totalPrice)}
                      </div>
                      <button
                        onClick={() => removeLine(idx)}
                        className="col-span-1 flex justify-center text-gray-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Phương thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={inputCls}
                >
                  <option value="COD">COD</option>
                  <option value="Momo">Momo</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Ghi chú
                </label>
                <textarea
                  value={createNote}
                  onChange={(e) => setCreateNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-[#FFE7BA] bg-white px-3 py-2 text-sm outline-none focus:border-[#FA8C00]"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FFF7E6] px-4 py-3">
                <span className="text-sm font-semibold text-[#5B3A0A]">
                  Tổng hóa đơn
                </span>
                <span className="text-xl font-bold text-[#FA8C00]">
                  {currency(total)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#FFE7BA] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            Đóng
          </button>
          {mode === "view" ? (
            <button
              onClick={handleSubmitStatus}
              disabled={!selectedStatus || updating}
              className="rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E07E00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Đang lưu..." : "Lưu trạng thái"}
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!customerId || lines.length === 0 || creating}
              className="rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E07E00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Đang tạo..." : "Tạo đơn hàng"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function Field({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-[#5B3A0A]">{value}</p>
    </div>
  );
}

export default OrderModal;
