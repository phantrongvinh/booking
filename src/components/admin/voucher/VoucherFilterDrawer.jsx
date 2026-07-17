import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFetch } from "@/hook/customHook";
import { fetchAllProduct } from "@/store/slices/productSlice";
import { discountTypeOptions } from "@/lib/voucherConstants";

const inputCls =
  "h-9 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none focus:border-[#FA8C00]";

const VoucherFilterDrawer = ({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}) => {
  const dispatch = useDispatch();
  const upd = (patch) => setFilters({ ...filters, ...patch });

  const fetchProductsCallback = useCallback(async () => {
    const products = await dispatch(fetchAllProduct()).unwrap();
    return { products };
  }, [dispatch]);

  const {
    data: { products },
  } = useFetch(fetchProductsCallback, { initialData: { products: [] } });

  const isPercent = filters.discountType === "0";
  const isAmount = filters.discountType === "1";

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[90vw] flex-col bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-[#5B3A0A]">
            <SlidersHorizontal className="h-4 w-4 text-[#FA8C00]" /> Bộ lọc nâng
            cao
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Khoảng thời gian hiệu lực
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => upd({ startDate: e.target.value })}
                className={inputCls}
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => upd({ endDate: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Loại giảm giá
            </label>
            <select
              value={filters.discountType}
              onChange={(e) =>
                upd({
                  discountType: e.target.value,
                  minValue: "",
                  maxValue: "",
                })
              }
              className={inputCls}
            >
              <option value="all">Tất cả</option>
              {discountTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {(isPercent || isAmount) && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                {isPercent ? "Khoảng % giảm" : "Khoảng giá trị giảm (đ)"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Từ"
                  value={filters.minValue}
                  onChange={(e) => upd({ minValue: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Đến"
                  value={filters.maxValue}
                  onChange={(e) => upd({ maxValue: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Áp dụng cho sản phẩm
            </label>
            <select
              value={filters.productId}
              onChange={(e) => upd({ productId: e.target.value })}
              className={inputCls}
            >
              <option value="all">Tất cả sản phẩm</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#FFE7BA] p-4">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            <RotateCcw className="h-4 w-4" /> Đặt lại
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E07E00]"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </aside>
    </>
  );
};

export default VoucherFilterDrawer;
