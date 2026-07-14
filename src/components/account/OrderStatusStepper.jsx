import { statusFlow } from "@/lib/orderConstants";
import { Check } from "lucide-react";

const OrderStatusStepper = ({ status }) => {
  const isCancelled = status === "Đã hủy";
  const currentIndex = statusFlow.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
        Đơn hàng đã bị hủy
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {statusFlow.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex;
        const isLast = idx === statusFlow.length - 1;
        const isCheckedIcon = isDone || (isActive && isLast);

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  isCheckedIcon
                    ? "border-[#FA8C00] bg-[#FA8C00] text-white"
                    : isActive
                      ? "border-[#FA8C00] bg-white text-[#FA8C00] ring-4 ring-[#FA8C00]/20"
                      : "border-gray-200 bg-white text-gray-300"
                }`}
              >
                {isCheckedIcon ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </div>
              <span
                className={`whitespace-nowrap text-[10px] font-semibold ${
                  isDone || isActive ? "text-[#5B3A0A]" : "text-gray-300"
                }`}
              >
                {step}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mx-1.5 mb-4 h-0.5 flex-1 rounded-full transition-all ${
                  isDone ? "bg-[#FA8C00]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
