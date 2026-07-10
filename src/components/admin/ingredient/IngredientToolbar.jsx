import { Search, SlidersHorizontal, Download, ChevronDown } from "lucide-react";

const IngredientToolbar = ({
  keyword,
  setKeyword,
  status,
  setStatus,
  onExport,
}) => {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      gap-4
      px-5
      py-4
      border-b
      border-slate-200
    "
    >
      {/* Search */}

      <div
        className="
        relative
        flex-1
        max-w-md
      "
      >
        <Search
          size={18}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm nguyên liệu..."
          className="
            w-full
            rounded-full
            bg-blue-50
            py-2
            pl-10
            pr-4
            text-sm
            outline-none
            placeholder:text-slate-400
            focus:ring-2
            focus:ring-blue-200
          "
        />
      </div>

      {/* Actions */}

      <div
        className="
        flex
        items-center
        gap-2
      "
      >
        {/* Status */}

        <div
          className="
          relative
        "
        >
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              appearance-none
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              py-2
              pr-9
              text-sm
              text-slate-600
              outline-none
              hover:bg-slate-50
            "
          >
            <option value="">Tất cả trạng thái</option>

            <option value="AVAILABLE">Còn hàng</option>

            <option value="LOW_STOCK">Sắp hết</option>

            <option value="OUT_OF_STOCK">Hết hàng</option>
          </select>

          <ChevronDown
            size={16}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              pointer-events-none
              text-slate-500
            "
          />
        </div>

        {/* Filter */}

        <button
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            hover:bg-slate-100
          "
        >
          <SlidersHorizontal size={18} />
        </button>

        {/* Export */}

        <button
          onClick={onExport}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            hover:bg-slate-100
          "
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default IngredientToolbar;
