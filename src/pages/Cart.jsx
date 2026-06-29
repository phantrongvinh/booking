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
  clearSelected,
  setCartItems,
} from "@/store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);

  const selectedProducts = useSelector(
    (state) => state.cart?.selectedProducts ?? [],
  );

  const selectedVoucher = useSelector((state) => state.cart?.selectedVoucher);

  const shippingFee = useSelector((state) => state.cart?.shippingFee ?? 0);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      setLoading(true);

      const data = await cartAPI.fetchCart();

      dispatch(setCartItems(data?.items ?? []));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= CRUD SINGLE ITEM =================
  const handleIncrease = async (productId, quantity) => {
    try {
      setLoading(true);

      await cartAPI.updateCartItem(productId, {
        quantity: quantity + 1,
      });

      await fetchCart();
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
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setLoading(true);

      await cartAPI.removeCartItem(productId);

      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // ================= BULK DELETE =================
  const handleRemoveSelected = async () => {
    try {
      if (!selectedProducts.length) {
        alert("Chưa chọn sản phẩm nào để xóa");
        return;
      }

      setLoading(true);

      await cartAPI.removeCartItems(selectedProducts);

      await fetchCart();
      dispatch(clearSelected());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCULATIONS =================
  const allSelected =
    cartItems.length > 0 && selectedProducts.length === cartItems.length;

  const selectedItems = (cartItems ?? []).filter((item) =>
    selectedProducts.includes(item.productId),
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const discount = selectedVoucher?.discount ?? 0;

  const total = subtotal + shippingFee - discount;

  // ================= HANDLERS =================
  const handleVoucherChange = (voucher) => {
    dispatch(setVoucher(voucher));
  };

  const handleCheckout = () => {
    if (!selectedItems.length) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

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
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
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

            <button
              onClick={handleRemoveSelected}
              className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Xóa đã chọn
            </button>
          </div>

          {/* ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId ?? item.id}
                item={item}
                selected={selectedProducts.includes(item.productId)}
                onToggle={() => dispatch(toggleSelected(item.productId))}
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
