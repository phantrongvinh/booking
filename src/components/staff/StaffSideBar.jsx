import {
  ChartColumn,
  Folder,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Tags,
  Users,
} from "lucide-react";
import SidebarItem from "./SideBarItem";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const StaffSideBar = ({ className = "" }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
  };

  return (
    <aside
      className={`bg-white border-r shadow-sm flex flex-col h-full ${className}`}
    >
      {/* Logo */}

      {/* Menu */}

      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active
        />

        <SidebarItem icon={<Package size={20} />} text="Orders" />

        <SidebarItem icon={<ShoppingBag size={20} />} text="Products" />

        <SidebarItem icon={<Tags size={20} />} text="Vouchers" />

        <SidebarItem icon={<Folder size={20} />} text="Categories" />

        <SidebarItem icon={<Users size={20} />} text="Customers" />

        <SidebarItem icon={<Star size={20} />} text="Reviews" />

        <SidebarItem icon={<ChartColumn size={20} />} text="Reports" />

        <SidebarItem icon={<Settings size={20} />} text="Settings" />
      </nav>

      {/* Logout */}

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StaffSideBar;
