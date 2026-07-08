const ProductPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between rounded-b-2xl border-t bg-white px-6 py-4">
      <p className="text-sm text-gray-500">
        Hiển thị {start} - {end} trong tổng số {totalItems} sản phẩm
      </p>

      <div className="flex items-center gap-2">
        <button
          className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`h-9 w-9 rounded-lg border ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ProductPagination;
