const CartSummary = ({
  subtotal = 10000,
  shippingFee = 10000,
  discount = 10000,
  total = 10000,
  voucher,
  setVoucher,
  voucherList = [],
  onCheckout,
}) => {
  return (
    <div className="w-full max-w-sm select-none">
      {/* Khối tóm tắt chính */}
      <div className="border border-[#FCECD2] rounded-[40px] p-8 bg-[#FFF4DE] font-bold text-[#111111]">
        <h2 className="text-lg mb-6">Tóm tắt đơn hàng</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Tạm tính</span>
            <span className="text-[#FF9922] text-2xl">
              {subtotal.toLocaleString()}đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Mã giảm</span>
            <span className="text-[#FF9922] text-2xl">
              {discount.toLocaleString()}đ
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800">Phí giao hàng</span>
            <span className="text-[#FF9922] text-2xl">
              {shippingFee.toLocaleString()}đ
            </span>
          </div>

          <div className="pt-2">
            <hr className="border-t border-gray-400" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg">Tổng cộng</span>
            <span className="text-[#FF9922] text-3xl">
              {total.toLocaleString()}đ
            </span>
          </div>
        </div>

        {/* Khu vực Voucher */}
        <div className="mt-8">
          <label className="block mb-2 text-base lowercase font-bold">
            voucher
          </label>

          <select
            value={voucher?.id || ""}
            onChange={(e) => {
              const selected = voucherList.find(
                (v) => v.id === Number(e.target.value),
              );
              setVoucher?.(selected || null);
            }}
            className="w-full bg-white h-12 px-4 rounded-sm border-none focus:outline-none shadow-inner"
          >
            <option value="">-- Chọn voucher --</option>

            {voucherList.map((v) => (
              <option key={v.id} value={v.id}>
                {v.code} - giảm {v.discount.toLocaleString()}đ
              </option>
            ))}
          </select>

          <button className="w-full mt-6 py-3 rounded-[20px] bg-[#D9D9D9] text-black font-bold text-base lowercase transition hover:bg-gray-400">
            áp dụng
          </button>
        </div>
      </div>

      {/* Nút Thanh toán ngay */}
      <button
        onClick={onCheckout}
        className="w-full mt-4 py-4 rounded-[30px] bg-[#F4C45F] text-black font-bold text-lg shadow-sm transition hover:bg-[#e0b250]"
      >
        Thanh toán ngay
      </button>
    </div>
  );
};

export default CartSummary;
