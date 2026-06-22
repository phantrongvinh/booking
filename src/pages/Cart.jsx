import { useSelector, useDispatch } from "react-redux";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import RecommendedProducts from "@/components/cart/RecommendedProducts";

import voucherList from "@/mockData/voucher";

import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  toggleSelected,
  toggleSelectAll,
} from "@/store/slices/cartSlice";

import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // chọn tất cả
  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const selectedItems = cartItems.filter((item) => item.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingFee = 10000;
  const discount = selectedVoucher?.discount || 0;

  const total = subtotal + shippingFee - discount;

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Giỏ hàng</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 rounded-3xl bg-[#F7E7BE] p-6">
          <div className="mb-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => dispatch(toggleSelectAll())}
            />

            <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                onToggle={(product_id) => dispatch(toggleSelected(product_id))}
                onIncrease={(product_id) => dispatch(increaseQty(product_id))}
                onDecrease={(product_id) => dispatch(decreaseQty(product_id))}
                onRemove={(product_id) => dispatch(removeFromCart(product_id))}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <CartSummary
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={total}
          voucher={selectedVoucher}
          setVoucher={setSelectedVoucher}
          voucherList={voucherList}
        />
      </div>

      <RecommendedProducts />
    </div>
  );
};

export default Cart;
