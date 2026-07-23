import { CheckCircle2, AlertTriangle, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ToastNotification = ({
  message,
  type = "success",
  errors = [],
  onClose,
}) => {
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        onClose();
      },
      errors.length > 0 ? 6000 : 3000,
    );
    return () => clearTimeout(timer);
  }, [onClose, errors.length]);

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
    warning: {
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50",
      text: "text-amber-800 dark:text-amber-300",
      iconColor: "text-amber-500",
      icon: AlertTriangle,
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  return (
    <div
      className={`fixed right-5 top-5 z-[9999] w-[340px] rounded-xl border shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-5 ${current.bg}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        <Icon className={`h-5 w-5 shrink-0 ${current.iconColor}`} />
        <div className="flex-1">
          <p className={`text-sm font-semibold ${current.text}`}>{message}</p>
          {errors.length > 0 && (
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`mt-0.5 flex items-center gap-1 text-xs underline-offset-2 hover:underline ${current.text} opacity-70`}
            >
              {showErrors ? "Ẩn chi tiết" : `Xem ${errors.length} lỗi`}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showErrors ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Error list */}
      {showErrors && errors.length > 0 && (
        <ul
          className={`border-t px-4 pb-3 pt-2 space-y-1 ${current.bg} rounded-b-xl border-current/10`}
        >
          {errors.map((e, i) => (
            <li
              key={i}
              className={`flex gap-1.5 text-xs ${current.text} opacity-80`}
            >
              <span className="mt-0.5 shrink-0">•</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToastNotification;
