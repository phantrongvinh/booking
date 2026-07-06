import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, staffName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-bold">Xác nhận xóa</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong className="text-[#5B3A0A] font-semibold">{staffName}</strong> khỏi
            hệ thống? Hành động này không thể hoàn tác và tài khoản liên quan sẽ bị vô hiệu hóa.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="h-10 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
