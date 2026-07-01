import {
  LayoutDashboard,
  ShoppingBag,
  Wheat,
  Cake,
  Printer,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/staff", label: "Tổng Quan", icon: LayoutDashboard, end: true },
  { to: "/staff/orders", label: "Đơn hàng", icon: ShoppingBag, end: true },
  // { to: "/don-xu-ly", label: "Đơn xử lý", icon: ClipboardList },
  { to: "/staff/products", label: "Sản phẩm", icon: Cake, end: true },
  { to: "/staff/ingredients", label: "Nguyên liệu", icon: Wheat, end: true },
  { to: "/staff/bill", label: "In phiếu chế biến", icon: Printer, end: true },
];

const StaffSideBar = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="leading-tight">
          <p className="text-lg text-muted-foreground">Tiệm bánh ngọt</p>
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

export default StaffSideBar;
