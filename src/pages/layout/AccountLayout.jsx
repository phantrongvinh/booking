import { NavLink, Outlet, useLocation } from "react-router-dom";
import { User, Bell, ShoppingBag, Heart, Ticket, Lock } from "lucide-react";

const nav = [
  { to: "/account", label: "Thông tin cá nhân", icon: User, exact: true },
  {
    to: "/account/notifications",
    label: "Thông báo",
    icon: Bell,
    exact: false,
  },
  {
    to: "/account/orders",
    label: "Đơn hàng của tôi",
    icon: ShoppingBag,
    exact: false,
  },
  {
    to: "/account/favorites",
    label: "Sản phẩm yêu thích",
    icon: Heart,
    exact: false,
  },
  { to: "/account/vouchers", label: "Kho voucher", icon: Ticket, exact: false },
  { to: "/account/password", label: "Đổi mật khẩu", icon: Lock, exact: false },
];

const AccountLayout = () => {
  const { pathname } = useLocation();

  // notification
  const notifications = [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-[#FFFBF2] h-[100vh]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 md:w-64 sticky top-4">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-[#FFE7BA] bg-white p-2 md:flex-col md:overflow-visible ">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              const Icon = item.icon;
              const showBadge =
                item.to === "/account/notifications" && unread > 0;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#FA8C00] text-white shadow-sm"
                      : "text-[#5B3A0A] hover:bg-[#FFF7E6]"
                  }`}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {showBadge && (
                    <span
                      className={`ml-auto hidden rounded-full px-1.5 text-[10px] font-bold md:inline ${
                        active
                          ? "bg-white/25 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {unread}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
