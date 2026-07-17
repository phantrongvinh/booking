import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Xóa",
  onConfirm,
  onClose,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#5B3A0A]">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#FFE7BA] px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-[#FFF7E6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
