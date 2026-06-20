import AccountSideBar from "@/components/account/AccountSideBar";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <div className=" py-10">
      <div className="container mx-auto py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="w-72 sticky top-24 self-start">
          <AccountSideBar />
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-6 bg-white rounded-2xl shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
