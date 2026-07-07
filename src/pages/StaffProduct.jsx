import ToastNotification from "@/components/admin/ToastNotification";
import Pagination from "@/components/Pagination";
import ProductModal from "@/components/staff/ProductModal";
import { useFetch } from "@/hook/customHook";
import { fetchAllCategory } from "@/store/slices/categorySlice";
import {
  fetchAllProduct,
  getProductIngredientByProductName,
} from "@/store/slices/productSlice";
import ulti from "@/ultis/ulti";
import {
  AlertTriangle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const StaffProduct = () => {
  //
  const inputCls =
    "h-9 rounded-lg border border-[#FFE7BA] bg-white px-3 text-xs outline-none focus:border-[#FA8C00]";

  // call api lây danh sách sau đó đưa vào custom hook useFetch để tránh re call
  const dispatch = useDispatch();
  const loadData = useCallback(async () => {
    const [categoryRes, productRes] = await Promise.allSettled([
      dispatch(fetchAllCategory()).unwrap(),
      dispatch(fetchAllProduct()).unwrap(),
    ]);

    return {
      categories: categoryRes.status === "fulfilled" ? categoryRes.value : [],
      products: productRes.status === "fulfilled" ? productRes.value : [],
    };
  }, [dispatch]);

  const {
    data: { categories, products },
    loading,
  } = useFetch(loadData, {
    initialData: {
      categories: [],
      products: [],
    },
  });
  // handle toast
  const [toast, setToast] = useState(null);

  // handle filter product
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [advOpen, setAdvOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [applied, setApplied] = useState({ min: "", max: "" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const ms = !q || p.name.toLowerCase().includes(q);
      const mc = category === "all" || p.categoryId === Number(category);
      const mst = status === "all" || p.status === status;
      let mp = true;
      if (applied.min) mp = mp && p.price >= parseFloat(applied.min);
      if (applied.max) mp = mp && p.price <= parseFloat(applied.max);
      return ms && mc && mst && mp;
    });
  }, [products, search, category, status, applied]);

  const resetAll = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setPriceRange({ min: "", max: "" });
    setApplied({ min: "", max: "" });
    setToast({ message: "Đã đặt lại bộ lọc & tìm kiếm", type: "success" });
  };
  // pagination
  useEffect(() => setPage(1), [search, category, status, applied]);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // handle danh sách thiếu nguyên liệu
  const recipeLoadedRef = useRef(new Set());
  const [recipeMap, setRecipeMap] = useState({});

  const loadRecipe = useCallback(
    async (productName) => {
      if (recipeLoadedRef.current.has(productName)) return;
      recipeLoadedRef.current.add(productName);

      try {
        const rs = await dispatch(
          getProductIngredientByProductName(productName),
        ).unwrap();

        setRecipeMap((prev) => ({ ...prev, [productName]: rs }));
      } catch (err) {
        console.error(err);
        recipeLoadedRef.current.delete(productName);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    pageItems.forEach((p) => loadRecipe(p.name));
  }, [pageItems, loadRecipe]);

  const LOW_STOCK = 10;

  const getStockWarning = (productName) => {
    const recipe = recipeMap[productName];

    if (!recipe) return null;

    const outOfStock = recipe.ingredients.filter((i) => i.currentStock <= 0);
    const lowStock = recipe.ingredients.filter(
      (i) => i.currentStock > 0 && i.currentStock <= LOW_STOCK,
    );

    if (outOfStock.length > 0) {
      return { type: "out", count: outOfStock.length, items: outOfStock };
    }
    if (lowStock.length > 0) {
      return { type: "low", count: lowStock.length, items: lowStock };
    }
    return null;
  };

  const renderStockWarning = (productName) => {
    const warning = getStockWarning(productName);

    if (!warning) {
      return <span className="text-xs text-emerald-600">Đủ nguyên liệu</span>;
    }

    const isOut = warning.type === "out";
    const label = isOut ? "hết hàng" : "sắp hết";
    const colorCls = isOut
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

    return (
      <span
        title={warning.items.map((i) => i.ingredientName).join(", ")}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${colorCls}`}
      >
        <AlertTriangle className="h-3 w-3" />
        {warning.count} {label}
      </span>
    );
  };

  // handle detail product
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openProduct = (p) => {
    setSelected(p);
    setModalOpen(true);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">
          Danh sách Sản phẩm
        </h1>
        <p className="text-sm text-gray-500">
          Quản lý sản phẩm và công thức nguyên liệu cần thiết.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FFE7BA] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FFE7BA] p-4">
          <h2 className="font-bold text-[#5B3A0A]">Tất cả sản phẩm</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="h-9 w-48 rounded-lg border border-[#FFE7BA] bg-white pl-8 pr-3 text-xs outline-none focus:border-[#FA8C00]"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
            <button
              onClick={() => setAdvOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#FFE7BA] px-3 text-xs font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Nâng cao
            </button>
            <button
              onClick={resetAll}
              title="Đặt lại"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#FFE7BA] text-gray-500 hover:bg-[#FFF7E6]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7E6] text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-right">Giá bán</th>
                <th className="px-4 py-3 text-left">Nguyên liệu</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                pageItems.map((p) => (
                  <tr
                    key={p.productId}
                    onClick={() => openProduct(p)}
                    className="cursor-pointer border-t border-[#FFE7BA] transition-colors hover:bg-[#FFF8E8]/60"
                  >
                    <td className="px-4 py-3 font-medium text-[#5B3A0A]">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover border border-[#FFE7BA]"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-product.png";
                          }}
                        />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.categoryName}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#FA8C00]">
                      {ulti.formatVND(p.salePrice ?? p.price)}
                    </td>
                    <td className="px-4 py-3">{renderStockWarning(p.name)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                          p.status === "stock"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {p.status === "stock" ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={filtered.length}
          pageSize={pageSize}
        />
      </div>

      {/* Advanced drawer */}
      <div
        onClick={() => setAdvOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${advOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[320px] max-w-[90vw] flex-col bg-white shadow-2xl transition-transform ${advOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-5 py-4">
          <div className="flex items-center gap-2 font-bold text-[#5B3A0A]">
            <SlidersHorizontal className="h-4 w-4 text-[#FA8C00]" /> Bộ lọc nâng
            cao
          </div>
          <button
            onClick={() => setAdvOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-5 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Khoảng giá bán (đ)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="h-9 w-full rounded-lg border border-[#FFE7BA] px-3 text-sm outline-none focus:border-[#FA8C00]"
              />
              <input
                type="number"
                placeholder="Đến"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="h-9 w-full rounded-lg border border-[#FFE7BA] px-3 text-sm outline-none focus:border-[#FA8C00]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-t border-[#FFE7BA] p-4">
          <button
            onClick={() => {
              setPriceRange({ min: "", max: "" });
              setApplied({ min: "", max: "" });
            }}
            className="rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            Đặt lại
          </button>
          <button
            onClick={() => {
              setApplied({ ...priceRange });
              setAdvOpen(false);
            }}
            className="flex-1 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E07E00]"
          >
            Áp dụng
          </button>
        </div>
      </aside>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selected}
        recipe={selected ? recipeMap[selected.name] : null}
      />
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default StaffProduct;
