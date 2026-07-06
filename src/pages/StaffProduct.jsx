import StatusBadge from "@/components/staff/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hook/customHook";
import { fetchAllCategory } from "@/store/slices/categorySlice";
import { fetchAllProduct } from "@/store/slices/productSlice";
import ulti from "@/ultis/ulti";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const StaffProduct = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    data: { products, categories },
    loading,
    fetch: reloadProducts,
  } = useFetch(
    async () => {
      const res = await Promise.allSettled([
        dispatch(fetchAllProduct()),
        dispatch(fetchAllCategory()),
      ]);

      return {
        products: res[0].status === "fulfilled" ? res[0].value.payload : [],
        categories: res[1].status === "fulfilled" ? res[1].value.payload : [],
      };
    },
    { initialData: { product: [], categories: [] } },
  );

  // filter product
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filteredProducts = products?.filter((item) => {
    const matchCategory =
      selectedCategory === "all" ||
      String(item.categoryId) === selectedCategory;

    const matchStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    const matchSearch = item.name.toLowerCase().includes(query.toLowerCase());

    return matchCategory && matchStatus && matchSearch;
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil((filteredProducts?.length || 0) / pageSize);

  const currentProducts = filteredProducts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <p className="text-gray-500">
          Quản lý menu bánh và tình trạng còn hàng
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* SEARCH */}
        <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* CATEGORY */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-10 w-full sm:w-52">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="all">Tất cả</SelectItem>
                {categories?.map((item) => (
                  <SelectItem
                    value={String(item.categoryId)}
                    key={item.categoryId}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* STATUS */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 w-full sm:w-44">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>

              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="stock">Còn hàng</SelectItem>
                <SelectItem value="unstock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <CreatProductDialog
            trigger={
              <Button className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 h-10 w-full sm:w-44">
                <Plus className="mr-1 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            }
            onSuccess={reloadProducts}
          /> */}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3">Mã SP</th>
                <th className="px-5 py-3">Tên sản phẩm</th>
                <th className="px-5 py-3">Mô tả</th>
                <th className="px-5 py-3">Danh mục</th>
                <th className="px-5 py-3">Tồn kho</th>
                <th className="px-5 py-3">Giá</th>
                <th className="px-5 py-3 text-right">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className=" py-8  text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentProducts?.length === 0 ? (
                <tr className="">
                  <td
                    colSpan={7}
                    className=" py-8  text-center text-muted-foreground"
                  >
                    Không tìm thấy sản phẩm.
                  </td>
                </tr>
              ) : (
                currentProducts?.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="px-5 py-3 font-semibold">{p.productId}</td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-9 w-9 rounded-lg object-cover border"
                        />
                        <span>{p.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {p.description}
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {p.categoryName}
                    </td>
                    <td className="px-5 py-3">{p.stockQuantity}</td>
                    <td className="px-5 py-3 font-medium">
                      {ulti.formatVND(p.price)}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t p-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, filteredProducts?.length)}
              {" / "}
              {filteredProducts?.length} sản phẩm
            </span>

            <div className="flex items-center gap-2">
              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Trước
              </button>

              <span className="text-sm">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffProduct;
