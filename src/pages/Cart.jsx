import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import RecommendedProducts from "@/components/cart/RecommendedProducts";

import voucherList from "@/mockData/voucher";
import cartAPI from "@/api/cartAPI";

import {
  toggleSelected,
  toggleSelectAll,
  setVoucher,
} from "@/store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedProducts = useSelector((state) => state.cart.selectedProducts);

  const selectedVoucher = useSelector((state) => state.cart.selectedVoucher);

  const shippingFee = useSelector((state) => state.cart.shippingFee);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      setLoading(true);

      const data = await cartAPI.fetchCart();
      setCartItems(data.items ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= CRUD CART =================
  const handleIncrease = async (productId, quantity) => {
    try {
      setLoading(true);

      await cartAPI.updateCartItem(productId, {
        quantity: quantity + 1,
      });

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (productId, quantity) => {
    try {
      setLoading(true);

      if (quantity <= 1) {
        await cartAPI.removeCartItem(productId);
      } else {
        await cartAPI.updateCartItem(productId, {
          quantity: quantity - 1,
        });
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setLoading(true);

      await cartAPI.removeCartItem(productId);

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCULATIONS =================
  const allSelected =
    cartItems.length > 0 && selectedProducts.length === cartItems.length;

  const selectedItems = cartItems.filter((item) =>
    selectedProducts.includes(item.productId),
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = selectedVoucher?.discount || 0;

  const total = subtotal + shippingFee - discount;

  // ================= HANDLERS =================
  const handleVoucherChange = (voucher) => {
    dispatch(setVoucher(voucher));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    // TODO:
    // // Sau này backend có API checkout
    // // thì gửi selectedItems lên backend
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Giỏ hàng</h1>

      {loading && (
        <div className="mb-4 text-center text-gray-600 font-medium">
          ⏳ Đang xử lý...
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 rounded-3xl bg-[#F7E7BE] p-6">
          <div className="mb-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() =>
                dispatch(
                  toggleSelectAll(cartItems.map((item) => item.productId)),
                )
              }
            />

            <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                selected={selectedProducts.includes(item.productId)}
                onToggle={(id) => dispatch(toggleSelected(id))}
                onIncrease={(id) => handleIncrease(id, item.quantity)}
                onDecrease={(id) => handleDecrease(id, item.quantity)}
                onRemove={handleRemove}
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
