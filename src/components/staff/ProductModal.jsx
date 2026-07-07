import { X, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

const LOW_STOCK = 10;

const getIngredientLevel = (currentStock) => {
  if (currentStock <= 0) return "out";
  if (currentStock <= LOW_STOCK) return "low";
  return "ok";
};

const levelConfig = {
  ok: {
    icon: CheckCircle2,
    cls: "text-emerald-600",
    tag: "Đủ hàng",
    tagCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  low: {
    icon: AlertTriangle,
    cls: "text-amber-600",
    tag: "Sắp hết",
    tagCls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  out: {
    icon: XCircle,
    cls: "text-rose-600",
    tag: "Hết hàng",
    tagCls: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function ProductModal({ open, onClose, product, recipe }) {
  if (!open || !product) return null;

  const price = product.salePrice ?? product.price;
  const ingredients = recipe?.ingredients ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-6 py-4">
          <h3 className="text-lg font-bold text-[#5B3A0A]">
            Chi tiết sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mb-4 h-48 w-full rounded-xl object-cover border border-[#FFE7BA]"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-product.png";
              }}
            />
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold text-[#5B3A0A]">
                {product.name}
              </h4>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                  product.status === "stock"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {product.status === "stock" ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="font-semibold text-[#FA8C00]">
                {price.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-gray-500">
                Danh mục:{" "}
                <b className="text-[#5B3A0A]">{product.categoryName}</b>
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#5B3A0A]">
              Nguyên liệu cần dùng
            </p>
            {!recipe ? (
              <p className="text-xs text-gray-400">Đang tải nguyên liệu...</p>
            ) : ingredients.length === 0 ? (
              <p className="text-xs text-gray-400">
                Không có dữ liệu nguyên liệu.
              </p>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ing) => {
                  const level = getIngredientLevel(ing.currentStock);
                  const cfg = levelConfig[level];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={ing.ingredientName}
                      className="flex items-center justify-between rounded-lg border border-[#FFE7BA] px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${cfg.cls}`} />
                        <div>
                          <p className="text-sm font-medium text-[#5B3A0A]">
                            {ing.ingredientName}
                          </p>
                          <p className="text-xs text-gray-400">
                            Cần {ing.quantityRequired} {ing.unit} / sản phẩm ·
                            Tồn kho {ing.currentStock} {ing.unit}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.tagCls}`}
                      >
                        {cfg.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-[#FFE7BA] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E07E00]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
