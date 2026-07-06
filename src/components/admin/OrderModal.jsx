import React, { useState, useEffect, useMemo } from "react";
import { X, ShoppingBag, User, MapPin, CreditCard, Ticket, Trash2, Plus, Minus } from "lucide-react";

// Dữ liệu mẫu phục vụ tạo đơn
const availableProducts = [
  { id: 101, name: "Bánh Kem Dâu Tây Grand", price: 350000, category: "Bánh kem" },
  { id: 102, name: "Bánh Croissant Bơ Pháp", price: 45000, category: "Bánh mì" },
  { id: 103, name: "Bánh Tiramisu Ý Classic", price: 85000, category: "Bánh ngọt" },
  { id: 104, name: "Bánh Mousse Chanh Dây", price: 65000, category: "Bánh ngọt" },
  { id: 105, name: "Bánh Bông Lan Trứng Muối", price: 120000, category: "Bánh mặn" },
  { id: 106, name: "Trà Đào Cam Sả", price: 39000, category: "Nước uống" },
];

const mockVouchers = [
  { code: "BANHNGOT50", type: "fixed", value: 50000, minOrder: 200000 },
  { code: "GIAM10", type: "percent", value: 10, minOrder: 100000 },
];

const OrderModal = ({ isOpen, onClose, onSave, order = null, mode = "view" }) => {
  // --- Create Mode States ---
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [cartItems, setCartItems] = useState([]); // { product, quantity }
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [paymentStatus, setPaymentStatus] = useState("Chưa thanh toán");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [note, setNote] = useState("");

  // --- View Mode States ---
  const [orderStatus, setOrderStatus] = useState("Chờ xác nhận");

  const [errors, setErrors] = useState({});

  // Reset/Load state
  useEffect(() => {
    if (isOpen) {
      if (mode === "view" && order) {
        setOrderStatus(order.status || "Chờ xác nhận");
      } else {
        // Reset create states
        setCustomerInfo({ fullName: "", phone: "", email: "", address: "" });
        setCartItems([]);
        setPaymentMethod("Tiền mặt");
        setPaymentStatus("Chưa thanh toán");
        setVoucherCode("");
        setAppliedVoucher(null);
        setNote("");
        setErrors({});
      }
    }
  }, [order, isOpen, mode]);

  if (!isOpen) return null;

  // --- Calculations for Create Mode ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedVoucher || subtotal < appliedVoucher.minOrder) return 0;
    if (appliedVoucher.type === "fixed") {
      return appliedVoucher.value;
    } else {
      return (subtotal * appliedVoucher.value) / 100;
    }
  }, [appliedVoucher, subtotal]);

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  // --- Add/Remove items in Create Mode ---
  const handleAddProduct = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // --- Apply Voucher ---
  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    const found = mockVouchers.find((v) => v.code === code);
    if (found) {
      if (subtotal < found.minOrder) {
        setErrors((prev) => ({
          ...prev,
          voucher: `Đơn hàng tối thiểu ${found.minOrder.toLocaleString("vi-VN")}đ để sử dụng mã này.`,
        }));
        setAppliedVoucher(null);
      } else {
        setAppliedVoucher(found);
        setErrors((prev) => ({ ...prev, voucher: null }));
      }
    } else {
      setErrors((prev) => ({ ...prev, voucher: "Mã giảm giá không tồn tại." }));
      setAppliedVoucher(null);
    }
  };

  // --- Form Validation & Submission ---
  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!customerInfo.fullName.trim()) newErrors.fullName = "Họ tên không được để trống";
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "SĐT không được để trống";
    } else if (!phoneRegex.test(customerInfo.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (cartItems.length === 0) newErrors.cart = "Vui lòng chọn ít nhất 1 sản phẩm";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        customerInfo,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
        payment: {
          paymentMethod,
          amount: totalPrice,
          status: paymentStatus,
        },
        voucher: appliedVoucher ? { code: appliedVoucher.code, discountValue: discount } : null,
        totalPrice,
        note,
      });
    }
  };

  const handleUpdateStatus = () => {
    onSave({ orderId: order.orderId, status: orderStatus });
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-[#5B3A0A] flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#FA8C00]" />
            {mode === "view" ? `Chi tiết đơn hàng #${order?.orderId}` : "Tạo đơn hàng mới (tại quầy)"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {mode === "view" && order ? (
            // ================= VIEW MODE =================
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Left Column: Order Items */}
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl border border-border bg-[#FFFDF8] p-4">
                  <h3 className="text-sm font-bold text-[#5B3A0A] mb-3">Danh sách món đặt</h3>
                  <div className="divide-y divide-border">
                    {order.items?.map((item) => (
                      <div key={item.productId} className="flex justify-between py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">
                            Đơn giá: {item.unitPrice?.toLocaleString("vi-VN")}đ x {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-gray-800">
                          {item.totalPrice?.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-3 space-y-1.5 text-sm">
                    {order.voucher && (
                      <div className="flex justify-between text-gray-500">
                        <span>Giảm giá (Mã: {order.voucher.code})</span>
                        <span>-{order.voucher.discountValue?.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-[#5B3A0A] pt-1">
                      <span>Tổng tiền thanh toán</span>
                      <span>{order.totalPrice?.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Notes */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-[#FFFDF8] p-4">
                    <h3 className="text-sm font-bold text-[#5B3A0A] mb-2 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#FA8C00]" />
                      Địa chỉ nhận hàng
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {order.shippingAddress || "Mua trực tiếp tại cửa hàng"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-[#FFFDF8] p-4">
                    <h3 className="text-sm font-bold text-[#5B3A0A] mb-2">Ghi chú đơn hàng</h3>
                    <p className="text-xs text-gray-600 italic">
                      {order.note || "Không có ghi chú"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Info & Status Update */}
              <div className="space-y-6">
                {/* Customer info */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h3 className="text-sm font-bold text-[#5B3A0A] border-b border-border pb-2 flex items-center gap-1">
                    <User className="h-4 w-4 text-[#FA8C00]" />
                    Thông tin khách hàng
                  </h3>
                  <div className="text-xs space-y-2">
                    <p>Họ tên: <strong className="text-gray-800">{order.customerName}</strong></p>
                    <p>SĐT: <span className="text-gray-600">{order.phone}</span></p>
                    <p>Email: <span className="text-gray-600">{order.email || "N/A"}</span></p>
                  </div>
                </div>

                {/* Billing info */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h3 className="text-sm font-bold text-[#5B3A0A] border-b border-border pb-2 flex items-center gap-1">
                    <CreditCard className="h-4 w-4 text-[#FA8C00]" />
                    Thanh toán
                  </h3>
                  <div className="text-xs space-y-2">
                    <p>Phương thức: <span className="font-semibold text-gray-800">{order.payment?.paymentMethod || "Tiền mặt"}</span></p>
                    <p>
                      Trạng thái:{" "}
                      <span
                        className={`font-semibold ${
                          order.payment?.status === "Đã thanh toán" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {order.payment?.status || "Chưa thanh toán"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Order Status Update */}
                <div className="rounded-xl border border-border bg-[#FFF7E6] p-4 space-y-4">
                  <h3 className="text-sm font-bold text-[#5B3A0A]">Cập nhật trạng thái đơn</h3>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-xs outline-none focus:border-[#FA8C00]"
                  >
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>

                  <button
                    onClick={handleUpdateStatus}
                    className="h-10 w-full rounded-lg bg-[#FA8C00] text-sm font-bold text-white hover:bg-[#D97706] transition-colors cursor-pointer"
                  >
                    Cập nhật trạng thái
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ================= CREATE MODE =================
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Form: Customer & Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#5B3A0A] border-b border-border pb-2 flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-[#FA8C00]" />
                  Thông tin người nhận
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên khách hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Nhập tên khách hàng"
                    className={`h-9 w-full rounded-lg border bg-background px-3 text-xs outline-none ${
                      errors.fullName ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-border hover:border-[#FFE7BA] focus:border-[#FA8C00]"
                    }`}
                  />
                  {errors.fullName && <p className="mt-1 text-[10px] text-rose-500">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Ví dụ: 0912345678"
                      className={`h-9 w-full rounded-lg border bg-background px-3 text-xs outline-none ${
                        errors.phone ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-border hover:border-[#FFE7BA] focus:border-[#FA8C00]"
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-[10px] text-rose-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email (nếu có)</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="guest@example.com"
                      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none hover:border-[#FFE7BA] focus:border-[#FA8C00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="Bỏ trống nếu mua trực tiếp"
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none hover:border-[#FFE7BA] focus:border-[#FA8C00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phương thức TT</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00]"
                    >
                      <option value="Tiền mặt">Tiền mặt</option>
                      <option value="Chuyển khoản">Chuyển khoản</option>
                      <option value="Momo">Momo</option>
                      <option value="ZaloPay">ZaloPay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái TT</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs outline-none focus:border-[#FA8C00]"
                    >
                      <option value="Chưa thanh toán">Chưa thanh toán</option>
                      <option value="Đã thanh toán">Đã thanh toán</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Yêu cầu đặc biệt..."
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs outline-none hover:border-[#FFE7BA] focus:border-[#FA8C00]"
                  />
                </div>
              </div>

              {/* Right Form: Select Products & Calc */}
              <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <h3 className="text-sm font-bold text-[#5B3A0A] pb-2 flex items-center gap-1.5">
                  <ShoppingBag className="h-4.5 w-4.5 text-[#FA8C00]" />
                  Chọn món ăn
                </h3>

                {/* Available Products Scroll list */}
                <div className="flex-1 max-h-[220px] overflow-y-auto mb-4 border border-border rounded-xl p-2 bg-gray-50/50 space-y-1.5">
                  {availableProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddProduct(p)}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-border/60 hover:border-[#FA8C00] cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{p.name}</p>
                        <span className="text-[10px] text-gray-400 font-bold">{p.category}</span>
                      </div>
                      <span className="text-xs font-bold text-[#FA8C00]">{p.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>

                {/* Cart selected items list */}
                <div className="flex-1 max-h-[200px] overflow-y-auto mb-4 border border-border rounded-xl p-3 bg-orange-50/15">
                  <h4 className="text-[11px] font-bold text-[#5B3A0A] mb-2 uppercase tracking-wide">
                    Đã chọn ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                  </h4>
                  {cartItems.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-6">Chưa chọn sản phẩm nào</p>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between border-b border-border/40 pb-2">
                          <div className="flex-1 pr-2">
                            <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                            <span className="text-[10px] text-gray-500">
                              {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.product.id, -1)}
                              className="p-1 rounded bg-white border border-border hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.product.id, 1)}
                              className="p-1 rounded bg-white border border-border hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.cart && <p className="mt-1 text-[10px] text-rose-500">{errors.cart}</p>}
                </div>

                {/* Vouchers and Bill calc summary */}
                <div className="border-t border-border pt-3 space-y-3">
                  {/* Voucher code input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Mã giảm giá (BANHNGOT50, GIAM10)"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-2 text-xs outline-none focus:border-[#FA8C00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="h-8 px-3 rounded-lg border border-[#FA8C00] text-[#FA8C00] text-xs font-bold hover:bg-[#FFF7E6] transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {errors.voucher && <p className="text-[10px] text-rose-500">{errors.voucher}</p>}
                  {appliedVoucher && (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      Đã áp dụng mã {appliedVoucher.code} (Giảm {discount.toLocaleString("vi-VN")}đ)
                    </p>
                  )}

                  {/* Pricing blocks */}
                  <div className="space-y-1 bg-white border border-border rounded-xl p-3 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Giảm giá</span>
                        <span>-{discount.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#5B3A0A] font-bold text-sm border-t border-border/60 pt-1.5">
                      <span>Tổng cộng</span>
                      <span className="text-[#FA8C00] text-base">{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="md:col-span-2 flex items-center justify-end gap-3 border-t border-border pt-4 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#FA8C00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#D97706] transition-colors shadow-md cursor-pointer"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
