import StatusBadge from "@/components/staff/StatusBadge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hook/customHook";
import { fetchAllIngredient } from "@/store/slices/ingredientSlice";
import ulti from "@/ultis/ulti";
import { ClipboardList, Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

const StaffIngredient = () => {
  const dispatch = useDispatch();

  const {
    data: { ingredients },
    loading,
  } = useFetch(
    async () => {
      const ingredients = await dispatch(fetchAllIngredient()).unwrap();

      return {
        ingredients,
      };
    },
    { initialData: { ingredients: [] } },
  );

  // handle filter
  const [query, setQuery] = useState("");

  const filteredIngredient = useMemo(() => {
    return ingredients.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [ingredients, query]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil((filteredIngredient?.length || 0) / pageSize);

  const currentIngredient = useMemo(() => {
    return filteredIngredient.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredIngredient, currentPage]);

  console.log(currentIngredient);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nguyên liệu</h1>
        <p className="text-gray-500">Theo dõi tồn kho và báo cáo hao hụt</p>
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
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3">Mã nguyên liệu</th>
                <th className="px-5 py-3">Tên nguyên liệu</th>
                <th className="px-5 py-3">Đơn vị</th>
                <th className="px-5 py-3">Số lượng</th>
                <th className="px-5 py-3">Giá đơn vị</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Kiểm kê</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-5 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentIngredient?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Không tìm thấy nguyên liệu.
                  </td>
                </tr>
              ) : (
                currentIngredient?.map((i) => (
                  <tr
                    key={i.id}
                    className="border-t hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="px-5 py-3 font-semibold">
                      {i.ingredientId}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span>{i.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {i.unit}
                    </td>

                    {i.currentStock <= 10 ? (
                      <td className="px-5 py-3 font-medium text-destructive">
                        {i.currentStock}
                      </td>
                    ) : (
                      <td className="px-5 py-3 font-medium">
                        {i.currentStock}
                      </td>
                    )}

                    <td className="px-5 py-3 font-medium">
                      {ulti.formatVND(i.costPerUnit)}
                    </td>

                    <td className="px-5 py-3 ">
                      <StatusBadge status={i.status} />
                    </td>

                    <td className="px-5 py-3 ">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <ClipboardList className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t p-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, filteredIngredient?.length)}
              {" / "}
              {filteredIngredient?.length} sản phẩm
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

export default StaffIngredient;
