import { ChevronLeft, ChevronRight } from "lucide-react";

const IngredientPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div
      className="
        flex flex-col gap-4
        border-t border-slate-200
        px-6 py-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      {/* Info */}

      <p className="text-sm text-slate-500">
        Hiển thị{" "}
        <span className="font-semibold text-slate-700">
          {start}-{end}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
        nguyên liệu
      </p>

      {/* Pagination */}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            border border-slate-200
            transition
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronLeft size={18} />
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="
                  px-2
                  text-slate-400
                "
            >
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  text-sm
                  font-medium
                  transition

                  ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white hover:bg-slate-100"
                  }
                `}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            border border-slate-200
            transition
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default IngredientPagination;
