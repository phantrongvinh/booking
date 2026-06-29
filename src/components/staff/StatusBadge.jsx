const StatusBadge = ({ status }) => {
  const map = {
    stock: "text-green-600 bg-green-100",
    unstock: "text-red-600 bg-red-100",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}>
      {status === "stock" ? "Còn hàng" : "Hết hàng"}
    </span>
  );
};

export default StatusBadge;
