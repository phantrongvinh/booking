const OrderSummary = ({
  items,
  subtotal,
  discount,
  shippingFee,
  total,
  onSubmit,
}) => {
  return (
    <div className="sticky top-24">
      <div className="rounded-[40px] border border-[#FCECD2] bg-[#FFF4DE] p-8">
        <h2 className="mb-6 text-2xl font-bold">Chi tiết đơn hàng</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product_id} className="flex gap-3">
              <img
                src={item.product_image}
                alt={item.product_name}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>

                <div className="mt-1 flex justify-between">
                  <span>Số lượng: x{item.quantity}</span>

                  <span className="font-semibold text-[#FF9922]">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Tạm tính</span>

            <span className="text-xl text-[#FF9922]">
              {subtotal.toLocaleString()}đ
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Mã giảm</span>

            <span className="text-xl text-[#FF9922]">
              -{discount.toLocaleString()}đ
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Phí giao hàng</span>

            <span className="text-xl text-[#FF9922]">
              {shippingFee.toLocaleString()}đ
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-6">
          <span className="text-lg font-bold">Tổng cộng</span>

          <span className="text-3xl font-bold text-[#FF9922]">
            {total.toLocaleString()}đ
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="mt-4 w-full rounded-[30px] bg-[#F4C45F] py-4 text-lg font-bold text-black transition hover:bg-[#e0b250]"
      >
        ĐẶT HÀNG NGAY
      </button>
    </div>
  );
};

export default OrderSummary;
