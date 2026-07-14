const IngredientStatCard = ({
  icon,
  title,
  value,
  color,
  badge,
  badgeColor,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`rounded-md px-2 py-1 text-[11px] font-semibold ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <h2 className="mt-1 text-[38px] font-bold leading-none text-slate-900">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default IngredientStatCard;
