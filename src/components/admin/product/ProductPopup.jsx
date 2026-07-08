import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  };

  const [form, setForm] = useState(initialForm);

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
      });
    } else {
      setForm(initialForm);
    }
  }, [product, open]);

  const isView = mode === "view";

  const handleChange = (e) => {
    if (isView) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    if (isView) return;

    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isView) return;

    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Thêm sản phẩm"
              : mode === "edit"
                ? "Sửa sản phẩm"
                : "Chi tiết sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label>Danh mục</label>

            <select
              name="categoryId"
              value={form.categoryId}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
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
            <label>Tên sản phẩm</label>

            <input
              name="name"
              value={form.name}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Kích cỡ</label>

            <input
              name="sizeName"
              value={form.sizeName}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Giá bán</label>

            <input
              type="number"
              name="price"
              value={form.price}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Giá vốn</label>

            <input
              type="number"
              name="costPrice"
              value={form.costPrice}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Số lượng</label>

            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <label>Mô tả</label>

            <textarea
              name="description"
              value={form.description}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <label>Hướng dẫn bảo quản</label>

            <textarea
              name="storageInstructions"
              value={form.storageInstructions}
              disabled={isView}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2 disabled:bg-gray-100"
            />
          </div>

          {mode !== "view" && (
            <div className="col-span-2">
              <label>Ảnh</label>

              <input type="file" accept="image/*" onChange={handleImage} />
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>

            {!isView && (
              <Button type="submit">
                {mode === "create" ? "Thêm sản phẩm" : "Lưu thay đổi"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPopup;
