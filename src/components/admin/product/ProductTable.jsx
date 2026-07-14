import { Eye, Pencil, Ban } from "lucide-react";

const ProductTable = ({ products, loading, onDelete, onView, onEdit }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-14 text-center text-slate-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-4 text-left">Mã SP</th>
            <th className="px-6 py-4 text-left">Sản phẩm</th>
            <th className="px-4 py-4 text-left">Danh mục</th>
            <th className="px-4 py-4 text-center">Giá bán</th>
            <th className="px-4 py-4 text-center">Tồn kho</th>
            <th className="px-4 py-4 text-center">Trạng thái</th>
            <th className="px-4 py-4 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr
                key={p.productId}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                {/* Mã */}
                <td className="px-6 py-4 font-semibold text-blue-600">
                  SP{String(p.productId).padStart(5, "0")}
                </td>

                {/* Thông tin */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                    />

                    <div>
                      <p className="font-semibold text-slate-800">{p.name}</p>

                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Danh mục */}
                <td className="px-4 py-4 text-slate-700">{p.categoryName}</td>

                {/* Giá */}
                <td className="px-4 py-4 text-center font-semibold text-slate-800">
                  {Number(p.price).toLocaleString("vi-VN")}đ
                </td>

                {/* Tồn kho */}
                <td
                  className={`px-4 py-4 text-center font-semibold ${
                    p.stockQuantity <= 10 ? "text-red-500" : "text-slate-700"
                  }`}
                >
                  {p.stockQuantity}
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.status === "Active" ? "Đang bán" : "Ngừng bán"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onView(p)}
                      className="text-blue-600 transition hover:scale-110"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() => onEdit(p)}
                      className="text-slate-600 transition hover:scale-110"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => onDelete(p.productId)}
                      className="text-red-500 transition hover:scale-110"
                    >
                      <Ban size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-14 text-center text-slate-500">
                Chưa có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
