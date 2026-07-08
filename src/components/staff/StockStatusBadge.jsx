const StockStatusBadge = ({ currentStock }) => {
  let label, className;

  if (currentStock <= 0) {
    label = "Hết hàng";
    className = "bg-red-100 text-red-600";
  } else if (currentStock <= 10) {
    label = "Sắp hết";
    className = "bg-yellow-100 text-yellow-700";
  } else {
    label = "Còn hàng";
    className = "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default StockStatusBadge;
