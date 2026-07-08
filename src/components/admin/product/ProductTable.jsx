import { Eye, Pencil, Ban } from "lucide-react";

const ProductTable = ({ products, loading, onDelete, onView, onEdit }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 text-sm">
          <tr>
            <th className="p-4 text-left">Mã SP</th>
            <th className="p-4 text-left">Sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá bán</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.productId} className="border-t hover:bg-gray-50">
                {/* Mã sản phẩm */}
                <td className="p-4 font-semibold text-blue-600">
                  SP{String(p.productId).padStart(5, "0")}
                </td>

                {/* Thông tin sản phẩm */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg border object-cover"
                    />

                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Danh mục */}
                <td>{p.categoryName}</td>

                {/* Giá */}
                <td className="font-semibold text-orange-600">
                  {new Intl.NumberFormat("vi-VN").format(p.price)}đ
                </td>

                {/* Tồn kho */}
                <td>{p.stockQuantity}</td>

                {/* Trạng thái */}
                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.status === "Active" ? "Đang bán" : "Ngừng kinh doanh"}
                  </span>
                </td>

                {/* Hành động */}
                <td>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => onView(p)}>
                      <Eye />
                    </button>

                    <button onClick={() => onEdit(p)}>
                      <Pencil />
                    </button>

                    <button onClick={() => onDelete(p.productId)}>
                      <Ban className="h-4 w-4 text-red-500 hover:scale-110 transition" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-500">
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
