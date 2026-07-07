import { useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import StaffSideBar from "@/components/staff/StaffSideBar";
import { Outlet } from "react-router-dom";

const StaffLayout = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <StaffSideBar />

        {/* Content */}
        <div className="flex flex-1 flex-col bg-[#FFFBF2]">
          <main className="flex-1 p-4 md:p-6 lg:p-8 mt-12">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default StaffLayout;
