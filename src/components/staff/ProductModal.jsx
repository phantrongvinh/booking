import {
  X,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Check,
  Pencil,
} from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFetch, useSubmit } from "@/hook/customHook";
import { fetchAllIngredient } from "@/store/slices/ingredientSlice";
import ToastNotification from "../admin/ToastNotification";
import {
  deleteProductIngredient,
  linkProductIngredient,
  updateProductIngredientQuantity,
} from "@/store/slices/productSlice";

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

export default function ProductModal({
  open,
  onClose,
  product,
  recipe,
  onIngredientAdded,
}) {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const fetchIngredientsCallback = useCallback(async () => {
    const ingredients = await dispatch(fetchAllIngredient()).unwrap();
    return { ingredients };
  }, [dispatch]);

  const {
    data: { ingredients: allIngredients },
  } = useFetch(fetchIngredientsCallback, {
    initialData: { ingredients: [] },
  });

  //
  const ingredientIdByName = useMemo(() => {
    const map = {};
    allIngredients.forEach((ing) => {
      map[ing.name] = ing.ingredientId;
    });
    return map;
  }, [allIngredients]);

  const [rows, setRows] = useState([
    { ingredientName: "", quantityRequired: 1 },
  ]);
  const [formError, setFormError] = useState("");

  const addRow = () =>
    setRows((prev) => [...prev, { ingredientName: "", quantityRequired: 1 }]);

  const removeRow = (idx) =>
    setRows((prev) => prev.filter((_, i) => i !== idx));

  const updateRow = (idx, patch) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const addIngredientCallback = useCallback(
    async (payload) => {
      for (const item of payload) {
        await dispatch(
          linkProductIngredient({
            productName: product?.name,
            ingredientName: item.ingredientName,
            quantityRequired: item.quantityRequired,
          }),
        ).unwrap();
      }
    },
    [dispatch, product],
  );

  const { submit: submitIngredients, loading: adding } = useSubmit(
    addIngredientCallback,
    {
      onSuccess: () => {
        setRows([{ ingredientName: "", quantityRequired: 1 }]);
        setFormError("");
        onIngredientAdded?.(product?.name);
        setToast({ message: "Thêm nguyên liệu thành công", type: "success" });
      },
      onError: (err) => {
        const message =
          typeof err === "string" ? err : "Thêm nguyên liệu thất bại.";
        setToast({ message, type: "error" });
      },
    },
  );

  const handleSubmitIngredients = () => {
    setFormError("");
    const invalidRow = rows.find(
      (r) => !r.ingredientName || r.quantityRequired <= 0,
    );
    if (invalidRow) {
      setFormError(
        "Vui lòng chọn nguyên liệu và nhập số lượng hợp lệ cho tất cả các dòng.",
      );
      return;
    }
    const duplicateNames = rows.map((r) => r.ingredientName);
    if (new Set(duplicateNames).size !== duplicateNames.length) {
      setFormError("Không được chọn trùng nguyên liệu trong cùng lượt thêm.");
      return;
    }
    submitIngredients(rows);
  };

  // ----- Sửa số lượng nguyên liệu hiện có -----
  const [editingName, setEditingName] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const startEdit = (ing) => {
    setEditingName(ing.ingredientName);
    setEditQuantity(String(ing.quantityRequired));
  };

  const cancelEdit = () => {
    setEditingName(null);
    setEditQuantity("");
  };

  const updateQuantityCallback = useCallback(
    async ({ ingredientId, quantityRequired }) => {
      await dispatch(
        updateProductIngredientQuantity({
          productId: product?.productId,
          ingredientId,
          quantityRequired,
        }),
      ).unwrap();
    },
    [dispatch, product],
  );

  const { submit: submitUpdateQuantity, loading: updatingQuantity } = useSubmit(
    updateQuantityCallback,
    {
      onSuccess: () => {
        cancelEdit();
        onIngredientAdded?.(product?.name);
        setToast({ message: "Đã cập nhật số lượng.", type: "success" });
      },
      onError: (err) => {
        setToast({
          message: typeof err === "string" ? err : "Cập nhật thất bại.",
          type: "error",
        });
      },
    },
  );

  const handleSaveQuantity = (ing) => {
    const qty = Number(editQuantity);
    if (!qty || qty <= 0) {
      setToast({ message: "Số lượng phải lớn hơn 0.", type: "error" });
      return;
    }
    const ingredientId = ingredientIdByName[ing.ingredientName];
    if (!ingredientId) {
      setToast({ message: "Không tìm thấy ID nguyên liệu.", type: "error" });
      return;
    }
    submitUpdateQuantity({ ingredientId, quantityRequired: qty });
  };

  // ----- Xóa nguyên liệu khỏi sản phẩm -----
  const deleteIngredientCallback = useCallback(
    async ({ ingredientId }) => {
      await dispatch(
        deleteProductIngredient({
          productId: product?.productId,
          ingredientId,
        }),
      ).unwrap();
    },
    [dispatch, product],
  );

  const { submit: submitDeleteIngredient, loading: deletingIngredient } =
    useSubmit(deleteIngredientCallback, {
      onSuccess: () => {
        onIngredientAdded?.(product?.name);
        setToast({
          message: "Đã xóa nguyên liệu khỏi sản phẩm.",
          type: "success",
        });
      },
      onError: (err) => {
        setToast({
          message: typeof err === "string" ? err : "Xóa nguyên liệu thất bại.",
          type: "error",
        });
      },
    });

  // handle delete
  const [confirmDel, setConfirmDel] = useState(null);

  const handleDeleteIngredient = (ing) => {
    const ingredientId = ingredientIdByName[ing.ingredientName];
    if (!ingredientId) {
      setToast({ message: "Không tìm thấy ID nguyên liệu.", type: "error" });
      return;
    }
    setConfirmDel({ ingredientId, name: ing.ingredientName });
  };

  if (!open || !product) return null;
  const price = product.salePrice ?? product.price;
  const ingredients = recipe?.ingredients ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
              <p className="text-xs text-gray-400">Chưa cập nhật nguyên liệu</p>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ing) => {
                  const level = getIngredientLevel(ing.currentStock);
                  const cfg = levelConfig[level];
                  const Icon = cfg.icon;
                  const isEditing = editingName === ing.ingredientName;
                  return (
                    <div
                      key={ing.ingredientName}
                      className="flex flex-nowrap items-center justify-between gap-2 rounded-lg border border-[#FFE7BA] px-3 py-2"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Icon className={`h-4 w-4 shrink-0 ${cfg.cls}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#5B3A0A]">
                            {ing.ingredientName}
                          </p>
                          {isEditing ? (
                            <div className="mt-1 flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0.01}
                                step="any"
                                autoFocus
                                value={editQuantity}
                                onChange={(e) =>
                                  setEditQuantity(e.target.value)
                                }
                                className="h-7 w-20 shrink-0 rounded border border-[#FFE7BA] px-2 text-xs outline-none focus:border-[#FA8C00]"
                              />
                              <span className="shrink-0 text-xs text-gray-400">
                                {ing.unit}
                              </span>
                            </div>
                          ) : (
                            <p className="truncate text-xs text-gray-400">
                              Cần {ing.quantityRequired} {ing.unit} / sản phẩm ·
                              Tồn kho {ing.currentStock} {ing.unit}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.tagCls}`}
                        >
                          {cfg.tag}
                        </span>
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveQuantity(ing)}
                              disabled={updatingQuantity}
                              className="flex h-7 w-7 items-center justify-center rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(ing)}
                              className="flex h-7 w-7 items-center justify-center rounded border border-[#FFE7BA] text-[#5B3A0A] hover:bg-[#FFF7E6]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteIngredient(ing)}
                              disabled={deletingIngredient}
                              className="flex h-7 w-7 items-center justify-center rounded border border-rose-200 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#5B3A0A]">
                Thêm nguyên liệu
              </p>
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1 rounded-lg bg-[#FFF2DC] px-2.5 py-1.5 text-xs font-semibold text-[#FA8C00] hover:bg-[#FFE7BA]"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm nguyên liệu
              </button>
            </div>

            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={row.ingredientName}
                    onChange={(e) =>
                      updateRow(idx, { ingredientName: e.target.value })
                    }
                    className="h-9 flex-1 rounded-lg border border-[#FFE7BA] bg-white px-2 text-sm outline-none focus:border-[#FA8C00]"
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {allIngredients.map((ing) => (
                      <option key={ing.ingredientId} value={ing.name}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0.01}
                    step="any"
                    value={row.quantityRequired}
                    onChange={(e) =>
                      updateRow(idx, {
                        quantityRequired: Number(e.target.value),
                      })
                    }
                    className="h-9 w-24 rounded-lg border border-[#FFE7BA] bg-white px-2 text-sm text-center outline-none focus:border-[#FA8C00]"
                  />
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {formError && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                {formError}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmitIngredients}
              disabled={adding}
              className="mt-3 w-full rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E07E00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding ? "Đang lưu..." : "Lưu nguyên liệu"}
            </button>
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
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirmDel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="w-[320px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <Trash2 className="h-5 w-5 text-rose-500" />
            </div>
            <h3 className="font-bold text-[#5B3A0A]">Xóa nguyên liệu</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold text-[#5B3A0A]">
                "{confirmDel.name}"
              </span>{" "}
              khỏi sản phẩm này?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 rounded-xl border border-[#FFE7BA] py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  submitDeleteIngredient({
                    ingredientId: confirmDel.ingredientId,
                  });
                  setConfirmDel(null);
                }}
                className="flex-1 rounded-xl bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
