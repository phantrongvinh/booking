import { TrendingUp } from "lucide-react";

const StatCard = ({ label, value, hint, icon: Icon, tone = "brand" }) => {
  const tones = {
    brand: "bg-[#FFF2DC] text-[#FA8C00]",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold text-[#5B3A0A]">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
