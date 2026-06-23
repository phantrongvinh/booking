import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useSelector } from "react-redux";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const selectedVoucher = useSelector((state) => state.cart.selectedVoucher);

  const shippingFee = useSelector((state) => state.cart.shippingFee);

  const selectedItems = cartItems?.filter((item) => item.selected);

  const subtotal = selectedItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = selectedVoucher?.discount || 0;

  const total = subtotal + shippingFee - discount;

  const handleCheckout = () => {
    console.log("Đặt hàng");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Thanh toán</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <CheckoutForm />
          <PaymentMethod />
        </div>

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
