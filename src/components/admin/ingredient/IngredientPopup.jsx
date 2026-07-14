import { X } from "lucide-react";
import { useEffect, useState } from "react";

const IngredientPopup = ({
  open,
  onClose,
  onSubmit,
  ingredient,
  mode = "create",
}) => {
  const [form, setForm] = useState({
    ingredientId: null,
    name: "",
    unit: "",
    currentStock: 0,
    costPerUnit: 0,
  });

  useEffect(() => {
    if (ingredient) {
      setForm({
        ingredientId: ingredient.ingredientId,

        name: ingredient.name || "",

        unit: ingredient.unit || "",

        currentStock: ingredient.currentStock || 0,

        costPerUnit: ingredient.costPerUnit || 0,
      });
    } else {
      setForm({
        ingredientId: null,
        name: "",
        unit: "",
        currentStock: 0,
        costPerUnit: 0,
      });
    }
  }, [ingredient]);

  if (!open) return null;

  const isView = mode === "view";

  const isEdit = mode === "edit";

  const handleChange = (e) => {
    if (isView) return;

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "currentStock" || name === "costPerUnit"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          p-6
          w-full
          max-w-lg
          shadow-xl
        "
      >
        {/* Header */}

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">
            {mode === "create" && "Thêm nguyên liệu"}

            {mode === "edit" && "Sửa nguyên liệu"}

            {mode === "view" && "Chi tiết nguyên liệu"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên nguyên liệu
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isView}
              placeholder="Tên nguyên liệu"
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                disabled:bg-gray-100
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Đơn vị</label>

            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              disabled={isView}
              placeholder="Kg, hộp, chai..."
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                disabled:bg-gray-100
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số lượng tồn
            </label>

            <input
              type="number"
              name="currentStock"
              value={form.currentStock}
              onChange={handleChange}
              disabled={isView}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                disabled:bg-gray-100
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giá nhập / đơn vị
            </label>

            <input
              type="number"
              name="costPerUnit"
              value={form.costPerUnit}
              onChange={handleChange}
              disabled={isView}
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                disabled:bg-gray-100
              "
            />
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4
              py-2
              border
              rounded-lg
              hover:bg-gray-100
            "
          >
            {isView ? "Đóng" : "Hủy"}
          </button>

          {!isView && (
            <button
              onClick={handleSubmit}
              className="
                px-5
                py-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
              "
            >
              {isEdit ? "Cập nhật" : "Lưu"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientPopup;
