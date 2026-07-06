import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import orderAPI from "@/api/orderAPI";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const selectedProducts = useSelector((state) => state.cart.selectedProducts);
  const selectedVoucher = useSelector((state) => state.cart.selectedVoucher);
  const shippingFee = useSelector((state) => state.cart.shippingFee);

  const [form, setForm] = useState({
    shippingAddress: "",
    phone: "",
    note: "",
    paymentMethod: 1,
  });

  const [errors, setErrors] = useState({});

  const selectedItems = cartItems.filter((item) =>
    selectedProducts.includes(item.productId),
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = selectedVoucher?.discount ?? 0;

  const total = subtotal + shippingFee - discount;

  // =========================
  // VALIDATE
  // =========================
  const validateCheckout = () => {
    const newErrors = {};

    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(form.phone.trim())) {
      newErrors.phone = "Số điện thoại phải là số";
    } else if (form.phone.trim().length !== 10) {
      newErrors.phone = "Số điện thoại phải đủ 10 số";
    }

    if (!form.shippingAddress.trim()) {
      newErrors.shippingAddress = "Địa chỉ không được để trống";
    } else if (form.shippingAddress.trim().length <= 10) {
      newErrors.shippingAddress = "Địa chỉ phải dài hơn 10 ký tự";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT ORDER
  // =========================
  const handleCheckout = async () => {
    if (!validateCheckout()) return;

    try {
      const payload = {
        shippingAddress: form.shippingAddress,
        phone: form.phone,
        note: form.note,
        paymentMethod: form.paymentMethod,
      };

      const res = await orderAPI.createOrder(payload);

      console.log("Order success:", res);
      alert("Đặt hàng thành công 🎉");
      navigate("/");
    } catch (err) {
      console.error(err?.response?.data || err);
      alert("Đặt hàng thất bại");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Thanh toán</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* FORM */}
        <div className="space-y-6">
          <CheckoutForm
            user={user}
            form={form}
            setForm={setForm}
            errors={errors}
          />

          <PaymentMethod form={form} setForm={setForm} />
        </div>

        {/* SUMMARY */}
        <OrderSummary
          items={selectedItems}
          subtotal={subtotal}
          discount={discount}
          shippingFee={shippingFee}
          total={total}
          voucher={selectedVoucher}
          onSubmit={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Checkout;
