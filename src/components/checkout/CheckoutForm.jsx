const CheckoutForm = () => {
  return (
    <div className="bg-[#FCECD2] rounded-3xl p-6 border border-orange-300">
      <h2 className="text-2xl font-semibold mb-4">Thông tin nhận hàng</h2>

      <div className="space-y-4">
        <div>
          <label className="font-medium">Họ tên</label>
          <input type="text" className="mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-3 transition focus:border-[#E48F45] focus:outline-none" />
        </div>

        <div>
          <label className="font-medium">Số điện thoại</label>
          <input type="text" className="mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-3 transition focus:border-[#E48F45] focus:outline-none" />
        </div>

        <div>
          <label className="font-medium">Địa chỉ</label>
          <input type="text" className="mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-3 transition focus:border-[#E48F45] focus:outline-none" />
        </div>

        <div>
          <label className="font-medium">Ghi chú</label>
          <textarea rows={4} className="mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-3 transition focus:border-[#E48F45] focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
