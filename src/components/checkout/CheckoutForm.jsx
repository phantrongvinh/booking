const CheckoutForm = ({ user, form, setForm, errors, onSubmit }) => {
  return (
    <div className="rounded-3xl border border-orange-300 bg-[#FCECD2] p-6">
      <h2 className="mb-4 text-2xl font-semibold">Thông tin nhận hàng</h2>

      <div className="space-y-4">
        {/* Họ tên */}
        <div>
          <label className="font-medium">Họ tên</label>
          <input
            type="text"
            value={user?.fullName || ""}
            disabled
            className="mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-gray-100 px-4 py-3"
          />
        </div>

        {/* SĐT */}
        <div>
          <label className="font-medium">Số điện thoại</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded-2xl border px-4 py-3"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="font-medium">Địa chỉ</label>
          <input
            type="text"
            value={form.shippingAddress}
            onChange={(e) =>
              setForm({ ...form, shippingAddress: e.target.value })
            }
            className="mt-1 w-full rounded-2xl border px-4 py-3"
          />
          {errors.shippingAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.shippingAddress}
            </p>
          )}
        </div>

        {/* Ghi chú */}
        <div>
          <label className="font-medium">Ghi chú</label>
          <textarea
            rows={4}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="mt-1 w-full rounded-2xl border px-4 py-3"
          />
          {errors.note && (
            <p className="text-red-500 text-sm mt-1">{errors.note}</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={onSubmit}
          className="w-full mt-4 bg-orange-400 text-white py-3 rounded-2xl"
        >
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
