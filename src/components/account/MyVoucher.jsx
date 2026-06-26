import VoucherItem from "./VoucherItem";

const MyVoucher = () => {
  const myVouchers = [
    {
      id: 1,
      code: "WELCOME20",
      title: "Giảm 20% toàn shop",
      description: "Giảm 20% cho tất cả sản phẩm.",
      discountType: "PERCENT",
      discountValue: 20,
      maxDiscount: 100000,
      minOrder: 500000,
      quantity: 1,
      status: "AVAILABLE",
      expireDate: "2026-07-31",
      remainDays: 5,
    },
    {
      id: 2,
      code: "FREESHIP",
      title: "Miễn phí vận chuyển",
      description: "Freeship toàn quốc.",
      discountType: "SHIPPING",
      discountValue: 50000,
      maxDiscount: 50000,
      minOrder: 199000,
      quantity: 2,
      status: "AVAILABLE",
      expireDate: "2026-08-05",
      remainDays: 10,
    },
    {
      id: 3,
      code: "SAVE100K",
      title: "Giảm 100.000đ",
      description: "Áp dụng cho đơn hàng từ 999.000đ.",
      discountType: "AMOUNT",
      discountValue: 100000,
      maxDiscount: 100000,
      minOrder: 999000,
      quantity: 1,
      status: "AVAILABLE",
      expireDate: "2026-08-15",
      remainDays: 20,
    },
    {
      id: 4,
      code: "FLASH50",
      title: "Flash Sale 50%",
      description: "Giảm 50% tối đa 200.000đ.",
      discountType: "PERCENT",
      discountValue: 50,
      maxDiscount: 200000,
      minOrder: 1000000,
      quantity: 1,
      status: "EXPIRING",
      expireDate: "2026-06-29",
      remainDays: 2,
    },
    {
      id: 5,
      code: "MEMBER30",
      title: "Thành viên VIP",
      description: "Giảm 30% cho khách hàng VIP.",
      discountType: "PERCENT",
      discountValue: 30,
      maxDiscount: 150000,
      minOrder: 700000,
      quantity: 1,
      status: "USED",
      expireDate: "2026-06-20",
      remainDays: 0,
    },
    {
      id: 6,
      code: "SUMMER150",
      title: "Khuyến mãi mùa hè",
      description: "Giảm 150.000đ.",
      discountType: "AMOUNT",
      discountValue: 150000,
      maxDiscount: 150000,
      minOrder: 1200000,
      quantity: 1,
      status: "EXPIRED",
      expireDate: "2026-05-30",
      remainDays: -20,
    },
    {
      id: 7,
      code: "NEWUSER50",
      title: "Khách hàng mới",
      description: "Giảm 50.000đ cho đơn đầu tiên.",
      discountType: "AMOUNT",
      discountValue: 50000,
      maxDiscount: 50000,
      minOrder: 300000,
      quantity: 1,
      status: "AVAILABLE",
      expireDate: "2026-09-10",
      remainDays: 45,
    },
    {
      id: 8,
      code: "HOTDEAL15",
      title: "Hot Deal 15%",
      description: "Giảm 15% tối đa 80.000đ.",
      discountType: "PERCENT",
      discountValue: 15,
      maxDiscount: 80000,
      minOrder: 400000,
      quantity: 3,
      status: "AVAILABLE",
      expireDate: "2026-10-01",
      remainDays: 66,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-[#6B4E41] mb-6">
        🎟 Kho Voucher của tôi
      </h2>

      <div className="space-y-5">
        {myVouchers.map((voucher) => (
          <VoucherItem key={voucher.id} voucher={voucher} />
        ))}
      </div>
    </div>
  );
};
export default MyVoucher;
