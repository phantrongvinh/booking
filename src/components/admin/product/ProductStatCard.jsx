const ProductStatCard = ({ icon, title, value, color, badge, badgeColor }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <h2 className="mt-1 text-4xl font-bold text-gray-900">{value}</h2>
    </div>
  );
};

export default ProductStatCard;
