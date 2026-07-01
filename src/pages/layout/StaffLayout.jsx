import { useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import StaffSideBar from "@/components/staff/StaffSideBar";
import StaffHeader from "./StaffHeader";
import { Outlet } from "react-router-dom";

const StaffLayout = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <StaffSideBar />

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <StaffHeader />

          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default StaffLayout;
