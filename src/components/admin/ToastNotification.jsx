import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

const ToastNotification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50",
      text: "text-emerald-800 dark:text-emerald-300",
      iconColor: "text-emerald-500",
      icon: CheckCircle2,
    },
    error: {
      bg: "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50",
      text: "text-rose-800 dark:text-rose-300",
      iconColor: "text-rose-500",
      icon: AlertTriangle,
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  return (
    <div
      className={`fixed right-5 top-5 z-[9999] flex w-[340px] items-center gap-3 rounded-xl border p-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-5 ${current.bg}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${current.iconColor}`} />
      <div className="flex-1">
        <p className={`text-sm font-semibold ${current.text}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastNotification;
