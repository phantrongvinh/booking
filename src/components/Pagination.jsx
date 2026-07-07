import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
  totalItems,
  pageSize,
}) => {
  const hasCount =
    typeof totalItems === "number" && typeof pageSize === "number";
  const startItem = hasCount
    ? totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1
    : null;
  const endItem = hasCount
    ? Math.min(currentPage * pageSize, totalItems)
    : null;

  if (totalPages <= 1 && !hasCount) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#FFE7BA] px-4 py-4">
      {hasCount && (
        <span className="text-xs text-gray-500">
          Hiển thị {startItem}-{endItem} trong tổng {totalItems} sản phẩm
        </span>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => onChange(currentPage - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFE7BA] text-gray-500 transition-all hover:bg-[#FFF7E6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onChange(pageNum)}
                className={`h-8 min-w-[34px] rounded-lg text-sm font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-[#FA8C00] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#FFF7E6] hover:text-[#5B3A0A]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onChange(currentPage + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#FFE7BA] text-gray-500 transition-all hover:bg-[#FFF7E6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
