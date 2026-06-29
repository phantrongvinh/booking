import AccountSideBar from "@/components/account/AccountSideBar";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <div className="py-6 md:py-10">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside
            className="
          w-full
          lg:w-72
          lg:sticky
          lg:top-24
          self-start
        "
          >
            <AccountSideBar />
          </aside>

          {/* Content */}
          <main
            className="
          flex-1
          bg-white
          rounded-xl lg:rounded-2xl
          shadow
          p-4
          sm:p-6
        "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
