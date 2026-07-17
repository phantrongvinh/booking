import { currency } from "@/lib/orderConstants";

export const discountTypeOptions = [
  { value: 0, label: "Giảm theo %" },
  { value: 1, label: "Giảm giá cố định" },
];

export const applyScopeOptions = [
  { value: 0, label: "Tất cả sản phẩm" },
  { value: 1, label: "Một số sản phẩm" },
];

export const formatDiscount = (v) =>
  v.discountType === 0 ? `${v.discountValue}%` : currency(v.discountValue);

export { currency };

// Số ngày còn lại tới hạn (âm = đã hết hạn)
export const getDaysLeft = (endDate) => {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const now = new Date();
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
};

export const getExpiryBadge = (endDate) => {
  const daysLeft = getDaysLeft(endDate);

  if (daysLeft <= 0) {
    return {
      label: "Đã hết hạn",
      cls: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }
  if (daysLeft <= 7) {
    return {
      label: `Sắp hết hạn (${daysLeft} ngày)`,
      cls: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  return null;
};
