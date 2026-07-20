import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { X, ClipboardCheck, AlertTriangle } from "lucide-react";
import { useSubmit } from "@/hook/customHook";
import { updateIngredientStock } from "@/store/slices/ingredientSlice";
import { getTodayCheckCount } from "@/lib/ingredientCheckHelper";

const IngredientModal = ({ open, onClose, ingredient, onSaved }) => {
  const dispatch = useDispatch();
  const [actual, setActual] = useState("");
  const [confirmedRecheck, setConfirmedRecheck] = useState(false);

  useEffect(() => {
    if (open && ingredient) {
      setActual(String(ingredient.currentStock));
      setConfirmedRecheck(false);
    }
  }, [open, ingredient]);

  const todayCheckCount = ingredient
    ? getTodayCheckCount(ingredient.ingredientId)
    : 0;
  const alreadyCheckedToday = todayCheckCount > 0;

  const { submit, loading, error, reset } = useSubmit(
    async ({ name, currentStock }) => {
      return await dispatch(
        updateIngredientStock({ name, currentStock }),
      ).unwrap();
    },
    {
      onSuccess: () => {
        onSaved?.();
      },
    },
  );

  if (!open || !ingredient) return null;

  const actualNum = actual === "" ? 0 : Number(actual);
  const loss = ingredient.currentStock - actualNum;
  const lossPct =
    ingredient.currentStock > 0 ? (loss / ingredient.currentStock) * 100 : 0;

  const handleSave = () => {
    if (alreadyCheckedToday && !confirmedRecheck) return;
    submit({ name: ingredient.name, currentStock: actualNum });
  };

  const handleClose = () => {
    reset?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#5B3A0A]">
            <ClipboardCheck className="h-5 w-5 text-[#FA8C00]" /> Kiểm kê nguyên
            liệu
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl bg-[#FFF7E6] p-4">
            <p className="text-sm font-bold text-[#5B3A0A]">
              {ingredient.name}
            </p>
            <p className="text-xs text-gray-500">Đơn vị: {ingredient.unit}</p>
          </div>

          <div className="rounded-lg border border-[#FFE7BA] p-3 text-sm">
            <p className="text-xs text-gray-400">Tồn kho hệ thống</p>
            <p className="font-bold text-[#5B3A0A]">
              {ingredient.currentStock} {ingredient.unit}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Số lượng thực tế đếm được
            </label>
            <input
              type="number"
              min={0}
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none focus:border-[#FA8C00]"
            />
          </div>

          <div
            className={`rounded-xl border p-4 ${
              loss > 0
                ? "border-rose-200 bg-rose-50"
                : loss < 0
                  ? "border-blue-200 bg-blue-50"
                  : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-600">Hao hụt</span>
              <span
                className={`font-bold ${
                  loss > 0
                    ? "text-rose-600"
                    : loss < 0
                      ? "text-blue-600"
                      : "text-emerald-600"
                }`}
              >
                {loss > 0 ? "-" : loss < 0 ? "+" : ""}
                {Math.abs(loss)} {ingredient.unit} (
                {Math.abs(lossPct).toFixed(1)}%)
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {loss > 0
                ? "Thực tế ít hơn hệ thống — có hao hụt cần ghi nhận."
                : loss < 0
                  ? "Thực tế nhiều hơn hệ thống — kiểm tra lại phiếu nhập."
                  : "Khớp với hệ thống, không có hao hụt."}
            </p>
          </div>

          {alreadyCheckedToday && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-700">
                    Đã kiểm kê {todayCheckCount} lần hôm nay
                  </p>
                  <p className="mt-0.5 text-xs text-amber-600">
                    Nguyên liệu này đã được kiểm kê trong hôm nay. Xác nhận nếu
                    bạn vẫn muốn kiểm kê lại.
                  </p>
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-medium text-amber-700">
                    <input
                      type="checkbox"
                      checked={confirmedRecheck}
                      onChange={(e) => setConfirmedRecheck(e.target.checked)}
                      className="h-4 w-4 accent-amber-600"
                    />
                    Tôi xác nhận muốn kiểm kê lại
                  </label>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-medium text-rose-600">
              Cập nhật thất bại, vui lòng thử lại.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#FFE7BA] px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6]"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading || (alreadyCheckedToday && !confirmedRecheck)}
            className="rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E07E00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu kiểm kê"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
