import { Pencil, Trash2, Eye } from "lucide-react";

const IngredientTable = ({ ingredients, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">Tên nguyên liệu</th>

            <th className="p-4">Đơn vị</th>

            <th className="p-4">Số lượng</th>

            <th className="p-4">Giá nhập</th>

            <th className="p-4">Trạng thái</th>

            <th className="p-4 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="
                  text-center
                  p-6
                  text-gray-500
                "
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            ingredients.map((item) => (
              <tr
                key={item.ingredientId}
                className="
                  border-b
                  hover:bg-gray-50
                "
              >
                <td className="p-4">{item.name}</td>

                <td className="p-4">{item.unit}</td>

                <td className="p-4">{item.currentStock}</td>

                <td className="p-4">{item.costPerUnit?.toLocaleString()} đ</td>

                <td className="p-4">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${
                        item.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {item.status === "AVAILABLE" ? "Còn hàng" : "Hết hàng"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="
                        p-2
                        hover:bg-gray-100
                        rounded
                      "
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="
                        p-2
                        hover:bg-gray-100
                        rounded
                      "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete?.(item)}
                      className="
                        p-2
                        hover:bg-red-100
                        rounded
                        text-red-500
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientTable;
