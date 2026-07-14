import { Outlet } from "react-router-dom";
import AdminSideBar from "@/components/admin/AdminSideBar";

const AdminLayout = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSideBar />

        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-6 overflow-auto ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
export default AdminLayout;
