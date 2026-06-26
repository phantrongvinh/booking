import ulti from "@/ultis/ulti";

const VoucherItem = ({ voucher }) => {
  const statusColor = {
    AVAILABLE: "bg-green-100 text-green-600",
    EXPIRING: "bg-yellow-100 text-yellow-700",
    USED: "bg-gray-100 text-gray-600",
    EXPIRED: "bg-red-100 text-red-600",
  };

  const statusText = {
    AVAILABLE: "Có thể dùng",
    EXPIRING: "Sắp hết hạn",
    USED: "Đã sử dụng",
    EXPIRED: "Hết hạn",
  };
  return (
    <div
      className={`bg-white rounded-2xl shadow border overflow-hidden flex ${
        voucher.status === "EXPIRED" || voucher.status === "USED"
          ? "opacity-60"
          : ""
      }`}
    >
      {/* Left */}
      <div className="w-40 bg-[#FFF4E8] flex flex-col justify-center items-center border-r">
        {voucher.discountType === "PERCENT" && (
          <>
            <h2 className="text-3xl font-bold text-[#FF7A00]">
              {voucher.discountValue}%
            </h2>
            <p className="text-[#6B4E41] font-medium">OFF</p>
          </>
        )}

        {voucher.discountType === "AMOUNT" && (
          <>
            <h2 className="text-2xl font-bold text-[#FF7A00]">
              {voucher.discountValue / 1000}K
            </h2>
            <p className="text-[#6B4E41] font-medium">Voucher</p>
          </>
        )}

        {voucher.discountType === "SHIPPING" && (
          <>
            <h2 className="text-3xl">🚚</h2>
            <p className="text-[#6B4E41] font-medium">Freeship</p>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex-1 p-5 flex justify-between">
        <div>
          <h3 className="font-semibold text-lg text-[#6B4E41]">
            {voucher.title}
          </h3>

          <p className="text-gray-500 mt-1">{voucher.description}</p>

          <p className="text-gray-500">
            Đơn tối thiểu: {ulti.formatVND(voucher.minOrder)}
          </p>

          {voucher.discountType !== "SHIPPING" && (
            <p className="text-gray-500">
              Giảm tối đa: {ulti.formatVND(voucher.maxDiscount)}
            </p>
          )}

          <p className="text-sm text-red-500 mt-3">HSD: {voucher.expireDate}</p>
        </div>

        <div className="flex flex-col justify-between items-end">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColor[voucher.status]
            }`}
          >
            {statusText[voucher.status]}
          </span>

          {voucher.status === "AVAILABLE" && (
            <button className="px-5 py-2 rounded-lg bg-[#FF7A00] text-white hover:bg-orange-600 transition">
              Dùng ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;
