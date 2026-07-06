import { useState } from "react";
import { useDispatch } from "react-redux";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSubmit } from "@/hook/customHook";
import { updateIngredientStock } from "@/store/slices/ingredientSlice"; // đổi theo action thật của bạn

const StockCheckDialog = ({ ingredient, onSuccess }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [stockInput, setStockInput] = useState(ingredient.currentStock);

  const { submit, loading, error, reset } = useSubmit(
    async ({ name, currentStock }) => {
      return await dispatch(
        updateIngredientStock({ name, currentStock }),
      ).unwrap();
    },
    {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
    },
  );

  const handleOpenChange = (v) => {
    setOpen(v);
    if (v) {
      setStockInput(ingredient.currentStock);
    } else {
      reset?.();
    }
  };

  const handleSubmit = () => {
    submit({ name: ingredient.name, currentStock: Number(stockInput) });
  };

  const diff = Number(stockInput) - ingredient.currentStock;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <ClipboardList className="h-4 w-4 text-blue-600" />
      </Button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Kiểm kê tồn kho — {ingredient.name} ({ingredient.ingredientId})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tồn kho hệ thống</span>
            <span className="font-medium text-foreground">
              {ingredient.currentStock} {ingredient.unit}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tồn kho thực tế</label>
            <input
              type="number"
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="border rounded-lg p-2 text-sm w-full"
              autoFocus
            />
          </div>

          {diff !== 0 && !isNaN(diff) && (
            <p
              className={`text-sm ${
                diff > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              Chênh lệch: {diff > 0 ? "+" : ""}
              {diff} {ingredient.unit}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500">{error.message || error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default StockCheckDialog;
