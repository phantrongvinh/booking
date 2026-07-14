import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Plus, Trash2 } from "lucide-react";

import ingredientAPI from "@/api/ingredientAPI";
import productIngredientAPI from "@/api/productIngredientAPI";

const ProductPopup = ({
  open,
  onOpenChange,
  categories,
  onSubmit,
  product,
  mode = "create",
}) => {
  const initialForm = {
    categoryId: "",
    name: "",
    sizeName: "",
    description: "",
    storageInstructions: "",
    price: "",
    costPrice: "",
    stockQuantity: "",
    image: null,
    ingredientId: "",
    quantityRequired: "",
  };

  const [form, setForm] = useState(initialForm);
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [preview, setPreview] = useState("");

  // Khi mở popup edit/view thì đổ dữ liệu sản phẩm vào form
  useEffect(() => {
    if (product) {
      setForm({
        categoryId: product.categoryId || "",
        name: product.name || "",
        sizeName: product.sizeName || "",
        description: product.description || "",
        storageInstructions: product.storageInstructions || "",
        price: product.price || "",
        costPrice: product.costPrice || "",
        stockQuantity: product.stockQuantity || "",
        image: null,

        ingredientId: "",
        quantityRequired: "",
      });

      setPreview(product.imageUrl || "");
    } else {
      setForm(initialForm);
      setIngredients([]);
      setPreview("");
    }
  }, [product, open]);

  useEffect(() => {
    if (!open) return;

    const fetchIngredients = async () => {
      try {
        const data = await ingredientAPI.fetchAllIngredient();
        setIngredientList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIngredients();
  }, [open]);

  useEffect(() => {
    if (!product || mode === "create") {
      setIngredients([]);
      return;
    }

    const fetchRecipe = async () => {
      try {
        const data = await productIngredientAPI.fetchProductIngredients(
          product.productId,
        );

        const recipe = data.ingredients || data || [];

        const mappedIngredients = recipe.map((item) => ({
          ingredientId: item.ingredientId || "",
          ingredientName: item.ingredientName || "",
          quantityRequired: item.quantityRequired,
          unit: item.unit || "",
          currentStock: item.currentStock || 0,
        }));

        setIngredients(mappedIngredients);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
  }, [product, mode]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const isView = mode === "view";
  const isAddIngredient = mode === "addIngredient";

  const handleChange = (e) => {
    if (isView) return;

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    if (isView) return;

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        ingredientId: "",
        ingredientName: "",
        quantityRequired: "",
        unit: "",
      },
    ]);
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const clone = [...prev];

      clone[index] = {
        ...clone[index],
        [field]: field === "ingredientId" ? Number(value) : value,
      };

      if (field === "ingredientId") {
        const ingredient = ingredientList.find(
          (i) => i.ingredientId === Number(value),
        );

        if (ingredient) {
          clone[index].ingredientName = ingredient.name;
          clone[index].unit = ingredient.unit;
        } else {
          clone[index].ingredientName = "";
          clone[index].unit = "";
        }
      }

      return clone;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isView) return;

    if (isAddIngredient) {
      onSubmit({
        ingredientId: Number(form.ingredientId),
        quantityRequired: Number(form.quantityRequired),
      });

      return;
    }

    onSubmit({
      ...form,
      ingredients: ingredients.map((item) => ({
        ...item,
        ingredientId: Number(item.ingredientId),
        quantityRequired: Number(item.quantityRequired),
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Thêm sản phẩm"
              : mode === "edit"
                ? "Sửa sản phẩm"
                : mode === "addIngredient"
                  ? "Thêm nguyên liệu"
                  : "Chi tiết sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= Thông tin sản phẩm ================= */}
          {!isAddIngredient && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tên sản phẩm
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    disabled={isView}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Danh mục
                    </label>

                    <select
                      name="categoryId"
                      value={form.categoryId}
                      disabled={isView}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                    >
                      <option value="">Chọn danh mục</option>

                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Kích cỡ
                    </label>

                    <input
                      name="sizeName"
                      value={form.sizeName}
                      disabled={isView}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Giá bán
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      disabled={isView}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Giá vốn
                    </label>

                    <input
                      type="number"
                      name="costPrice"
                      value={form.costPrice}
                      disabled={isView}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Tồn kho
                    </label>

                    <input
                      type="number"
                      name="stockQuantity"
                      value={form.stockQuantity}
                      disabled={isView}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-2 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* ================= Ảnh ================= */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hình ảnh
                </label>

                <div className="flex h-60 items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gray-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImagePlus className="mx-auto mb-2 h-10 w-10" />
                      <p>Chưa có hình ảnh</p>
                    </div>
                  )}
                </div>

                {!isView && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="mt-3 w-full"
                  />
                )}
              </div>
            </div>
          )}

          {!isAddIngredient && (
            <>
              {/* ================= Mô tả ================= */}
              <div>
                <label className="mb-1 block text-sm font-medium">Mô tả</label>

                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  disabled={isView}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 disabled:bg-gray-100"
                />
              </div>

              {/* ================= Bảo quản ================= */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Hướng dẫn bảo quản
                </label>

                <textarea
                  name="storageInstructions"
                  rows={4}
                  value={form.storageInstructions}
                  disabled={isView}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 disabled:bg-gray-100"
                />
              </div>
            </>
          )}
          {/* ================= Công thức ================= */}
          {mode !== "create" && !isAddIngredient && (
            <div className="rounded-xl border">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-semibold">Công thức nguyên liệu</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left">Nguyên liệu</th>
                      <th className="w-40 px-3 py-3 text-left">Số lượng</th>
                      <th className="w-32 px-3 py-3 text-left">Đơn vị</th>

                      {!isView && (
                        <th className="w-20 px-3 py-3 text-center">Xóa</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {ingredients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isView ? 3 : 4}
                          className="py-6 text-center text-gray-400"
                        >
                          Chưa có nguyên liệu
                        </td>
                      </tr>
                    ) : (
                      ingredients.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">
                            <input
                              readOnly
                              value={item.ingredientName || ""}
                              className="w-full rounded-lg border bg-gray-100 p-2"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              step="0.001"
                              value={item.quantityRequired}
                              disabled={isView}
                              onChange={(e) =>
                                handleIngredientChange(
                                  index,
                                  "quantityRequired",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border p-2"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              readOnly
                              value={item.unit || ""}
                              className="w-full rounded-lg border bg-gray-100 p-2"
                            />
                          </td>

                          {!isView && (
                            <td className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredient(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {isAddIngredient && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nguyên liệu
                </label>

                <select
                  value={form.ingredientId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ingredientId: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-2"
                >
                  <option value="">Chọn nguyên liệu</option>

                  {ingredientList.map((item) => (
                    <option key={item.ingredientId} value={item.ingredientId}>
                      {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Số lượng cần dùng
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.quantityRequired}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantityRequired: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-2"
                />
              </div>
            </div>
          )}

          {/* ================= Button ================= */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>

            {!isView && (
              <Button type="submit">
                {mode === "create"
                  ? "Thêm sản phẩm"
                  : mode === "addIngredient"
                    ? "Thêm nguyên liệu"
                    : "Lưu thay đổi"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPopup;
