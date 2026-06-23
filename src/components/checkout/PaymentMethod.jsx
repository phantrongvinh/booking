const PaymentMethod = () => {
  return (
    <div className="bg-[#FCECD2] rounded-3xl p-6 border border-orange-300">
      <h2 className="text-2xl font-semibold mb-4">Phương thức thanh toán</h2>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" defaultChecked />
          <span>Tiền mặt</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" />
          <span>MOMO</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
