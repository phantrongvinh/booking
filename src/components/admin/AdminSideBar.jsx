import {
  LayoutDashboard,
  ShoppingBag,
  Wheat,
  Cake,
  LogOut,
  User,
  UserPen,
  Ticket,
  ScrollText,
  Globe,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Tổng Quan", icon: LayoutDashboard, end: true },
  { to: "/admin/adorder", label: "Đơn hàng", icon: ShoppingBag, end: true },
  { to: "/admin/adproduct", label: "Sản phẩm", icon: Cake, end: true },
  { to: "/admin/ingredients", label: "Nguyên liệu", icon: Wheat, end: true },
  { to: "/admin/aduser", label: "Khách hàng", icon: User, end: true },
  { to: "/admin/adstaff", label: "Nhân viên", icon: UserPen, end: true },
  { to: "/admin/vouchers", label: "Voucher", icon: Ticket, end: true },
  { to: "/admin/blogs", label: "Bài viết", icon: ScrollText, end: true },
  { to: "/admin/adweb", label: "Quản lý web", icon: Globe, end: true },
];

const AdminSideBar = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="leading-tight">
          <Link to={"/"}>
            <p className="text-lg text-muted-foreground">Tiệm bánh ngọt</p>
          </Link>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          return (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-orange-100 text-orange-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-orange-500",
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
