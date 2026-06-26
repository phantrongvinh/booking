import { useState } from "react";
import StaffHeader from "./StaffHeader";
import { Outlet } from "react-router-dom";
import StaffSideBar from "@/components/staff/StaffSideBar";

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <StaffHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-72 z-40">
        <StaffSideBar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition ${
          sidebarOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Drawer */}
        <StaffSideBar
          className={`absolute left-0 top-0 h-full w-72 transform bg-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        />
      </div>

      {/* Content */}
      <main className="pt-16 lg:ml-72 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
