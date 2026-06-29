import { Bell, Menu, Search } from "lucide-react";

const StaffHeader = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-white/90 px-6 py-4 backdrop-blur">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none ml-2"
          />
        </div>

        {/* Notification */}
        <button className="relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/avatar.jpg" className="w-10 h-10 rounded-full" />

          <div className="hidden md:block">
            <p className="font-medium">Staff</p>
            <p className="text-xs text-gray-500">staff@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
