export const statusOptions = [
  { value: "1", label: "Đang làm" },
  { value: "2", label: "Đang giao" },
  { value: "3", label: "Hoàn thành" },
];

export const allStatusLabels = [
  "Chờ xác nhận",
  "Đang làm",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

export const statusStyles = {
  "Chờ xác nhận": "border-amber-200 bg-amber-50 text-amber-700",
  "Đang làm": "border-blue-200 bg-blue-50 text-blue-700",
  "Đang giao": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "Hoàn thành": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đã hủy": "border-rose-200 bg-rose-50 text-rose-700",
};

export const statusDot = {
  "Chờ xác nhận": "bg-amber-500",
  "Đang làm": "bg-blue-500",
  "Đang giao": "bg-indigo-500",
  "Hoàn thành": "bg-emerald-500",
  "Đã hủy": "bg-rose-500",
};

export const paymentMethods = ["COD", "Momo", "Chuyển khoản"];

export const currency = (n) => (n ?? 0).toLocaleString("vi-VN") + "đ";
