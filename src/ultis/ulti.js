// format hiện thỉ giá tiền
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// giới hạn đoạn văn
const limitString = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, str.lastIndexOf(" ", maxLength)) + "...";
};

// chia cột theo hàng
const splitIntoColumns = (arr, numCols) => {
  const cols = Array.from({ length: numCols }, () => []);
  arr.forEach((item, i) => cols[i % numCols].push(item));
  return cols;
};

const ulti = {
  formatVND,
  limitString,
  splitIntoColumns,
};
export default ulti;
