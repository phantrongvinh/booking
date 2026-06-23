import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  setVoucher,
} from "@/store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const selectedVoucher = useSelector((state) => state.cart.selectedVoucher);

  const shippingFee = useSelector((state) => state.cart.shippingFee);

  // chọn tất cả
  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const selectedItems = cartItems.filter((item) => item.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = selectedVoucher?.discount || 0;

  const total = subtotal + shippingFee - discount;

  const handleVoucherChange = (voucher) => {
    dispatch(setVoucher(voucher));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    navigate("/checkout");
  };
  console.log({
    subtotal,
    shippingFee,
    discount,
    total,
  });

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
          setVoucher={handleVoucherChange}
          voucherList={voucherList}
          onCheckout={handleCheckout}
        />
      </div>

      <RecommendedProducts />
    </div>
  );
};

export default Cart;
