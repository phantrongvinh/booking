import { TrendingUp } from "lucide-react";

const StatCard = ({ icon, label, value, accent, delta }) => {
  return (
    <div className="rounded-2xl border border-orange-100 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
        >
          {icon}
        </span>
        {delta && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600 shadow-sm">
            <TrendingUp className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-gray-600">
        {value}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
};

export default StatCard;
