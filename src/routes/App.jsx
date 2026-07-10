import Auth from "@/pages/Auth";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Home from "@/pages/Home";
import MainLayout from "@/pages/layout/MainLayout";
import Menu from "@/pages/Menu";
import ProductDetail from "@/pages/ProductDetail";
import Notfound from "@/pages/Notfound";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOtp from "@/pages/VerifyOtp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Profile from "@/components/account/Profile";
import AccountLayout from "@/pages/layout/AccountLayout";
import Notification from "@/components/account/Notificaton";
import Order from "@/components/account/Order";
import Addresses from "@/components/account/Addresses";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import { PrivateRoute, PublicOnlyRoute } from "./ProtectedRoute";
import MyVoucher from "@/components/account/MyVoucher";
import StaffLayout from "@/pages/layout/StaffLayout";
import StaffHome from "@/pages/StaffHome";
import StaffOrder from "@/pages/StaffOrder";
import StaffProduct from "@/pages/StaffProduct";
import StaffIngredient from "@/pages/StaffIngredient";
import AdUser from "@/pages/AdUser";
import AdStaff from "@/pages/AdStaff";
import AdOrder from "@/pages/AdOrder";
import AdProduct from "@/pages/AdProduct";
import AdminLayout from "@/pages/layout/AdminLayout";
import AdIngredient from "@/pages/AdIngredient";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Không dùng layout — chỉ chặn user ĐÃ đăng nhập quay lại */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Dùng layout — MỞ CHO TẤT CẢ, không cần PublicOnlyRoute */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:productId" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Account route layout — CẦN đăng nhập */}
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Profile />} />
            <Route path="notification" element={<Notification />} />
            <Route path="orders" element={<Order />} />
            <Route path="address" element={<Addresses />} />
            <Route path="voucher" element={<MyVoucher />} />
          </Route>
        </Route>

        {/* Staff routes — chỉ role STAFF hoặc ADMIN */}
        <Route
          path="/staff"
          element={
            <PrivateRoute roles={["STAFF", "ADMIN"]}>
              <StaffLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<StaffHome />} />
          <Route path="orders" element={<StaffOrder />} />
          <Route path="orders/:id" element={<StaffOrder />} />
          <Route path="products" element={<StaffProduct />} />
          <Route path="ingredients" element={<StaffIngredient />} />
        </Route>
        {/* Admin routes — CẦN bảo vệ bằng PrivateRoute */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="aduser" element={<AdUser />} />
          <Route path="adstaff" element={<AdStaff />} />
          <Route path="adorder" element={<AdOrder />} />
          <Route path="adproduct" element={<AdProduct />} />
          <Route path="adingredient" element={<AdIngredient />} />
        </Route>

        {/* Route không tồn tại */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
