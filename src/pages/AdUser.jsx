import { useFetch } from "@/hook/customHook";
import customerAPI from "@/api/customerAPI";
import { Search, Eye, Users, UserPlus, TrendingUp, X } from "lucide-react";
import { useState, useMemo } from "react";

// ── Avatar chữ cái đầu ──────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, change, changeColor, iconBg }) => (
  <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {change && (
        <span className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${changeColor}`}>
          <TrendingUp className="h-3 w-3" />
          {change}
        </span>
      )}
    </div>
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
  </div>
);

// ── Customer detail modal ────────────────────────────────────────────────────
const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Avatar + Name */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          {customer.avatarUrl ? (
            <img
              src={customer.avatarUrl}
              alt={customer.fullName}
              className="h-20 w-20 rounded-full border-2 border-border object-cover"
            />
          ) : (
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ${getAvatarColor(customer.fullName)}`}
            >
              {getInitials(customer.fullName)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold">{customer.fullName || "Chưa cập nhật"}</h2>
            <p className="text-sm text-muted-foreground">ID: #{customer.userId}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 text-sm">
          <InfoRow label="Username" value={customer.username} />
          <InfoRow label="Email" value={customer.email} />
          <InfoRow label="Điện thoại" value={customer.phone} />
          <InfoRow label="Giới tính" value={customer.gender} />
          <InfoRow label="Ngày sinh" value={formatDate(customer.birthday)} />
          <InfoRow label="Địa chỉ" value={customer.address} />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/40 px-4 py-2.5">
    <span className="shrink-0 font-medium text-muted-foreground">{label}</span>
    <span className="text-right">{value || "—"}</span>
  </div>
);

// ── Main page ────────────────────────────────────────────────────────────────
const AdUser = () => {
  const {
    data: customers,
    loading,
  } = useFetch(() => customerAPI.fetchCustomers(), {
    initialData: [],
  });

  // ── Search & filter ──
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredCustomers = useMemo(() => {
    if (!customers || !Array.isArray(customers)) return [];
    return customers.filter((c) => {
      const matchSearch =
        !query ||
        c.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        c.email?.toLowerCase().includes(query.toLowerCase()) ||
        c.phone?.includes(query) ||
        c.username?.toLowerCase().includes(query.toLowerCase());

      const matchGender = genderFilter === "all" || c.gender === genderFilter;

      return matchSearch && matchGender;
    });
  }, [customers, query, genderFilter]);

  // ── Pagination ──
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page khi filter thay đổi
  const handleQueryChange = (val) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const handleGenderChange = (val) => {
    setGenderFilter(val);
    setCurrentPage(1);
  };

  // ── Detail modal ──
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ── Pagination buttons ──
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      items.push(1);
      if (start > 2) items.push("...");
    }

    for (let i = start; i <= end; i++) items.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) items.push("...");
      items.push(totalPages);
    }

    return items;
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Danh sách Khách hàng</h1>
        <p className="text-muted-foreground">Quản lý thông tin khách hàng</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          label="Tổng khách hàng"
          value={customers?.length?.toLocaleString("vi-VN") || 0}
          change="+5.2%"
          changeColor="text-emerald-600"
          iconBg="bg-blue-500"
        />
        <StatCard
          icon={UserPlus}
          label="Khách hàng mới (tháng)"
          value="—"
          changeColor="text-emerald-600"
          iconBg="bg-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Tổng doanh thu TB"
          value="—"
          iconBg="bg-violet-500"
        />
      </div>

      {/* ── Table card ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* ── Filter bar ── */}
        <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Tìm theo tên, email, SĐT…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={genderFilter}
              onChange={(e) => handleGenderChange(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* ── Count ── */}
        <div className="flex items-center justify-end border-b border-border px-5 py-2">
          <span className="text-xs text-muted-foreground">
            Hiển thị {filteredCustomers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(currentPage * pageSize, filteredCustomers.length)} trong số{" "}
            {filteredCustomers.length} khách hàng
          </span>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Thông tin liên lạc</th>
                <th className="px-5 py-3">Giới tính</th>
                <th className="px-5 py-3">Địa chỉ</th>
                <th className="px-5 py-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-blue-500" />
                      <span className="text-sm text-muted-foreground">Đang tải…</span>
                    </div>
                  </td>
                </tr>
              ) : currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-muted-foreground">
                    Không tìm thấy khách hàng.
                  </td>
                </tr>
              ) : (
                currentCustomers.map((c) => (
                  <tr
                    key={c.userId}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-muted/30"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    {/* ── Avatar + Name ── */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {c.avatarUrl ? (
                          <img
                            src={c.avatarUrl}
                            alt={c.fullName}
                            className="h-10 w-10 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(c.fullName)}`}
                          >
                            {getInitials(c.fullName)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{c.fullName || "Chưa cập nhật"}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: #CUS-{String(c.userId).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ── Contact ── */}
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">✉ {c.email || "—"}</p>
                        <p className="text-muted-foreground">☎ {c.phone || "—"}</p>
                      </div>
                    </td>

                    {/* ── Gender ── */}
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          c.gender === "Nam"
                            ? "bg-blue-50 text-blue-700"
                            : c.gender === "Nữ"
                              ? "bg-pink-50 text-pink-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.gender || "—"}
                      </span>
                    </td>

                    {/* ── Address ── */}
                    <td className="px-5 py-3 text-muted-foreground">
                      {c.address || "—"}
                    </td>

                    {/* ── Actions ── */}
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3">
            <button
              className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ‹
            </button>

            {getPaginationItems().map((item, idx) =>
              item === "..." ? (
                <span key={`dot-${idx}`} className="px-2 text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    currentPage === item
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </>
  );
};

export default AdUser;
