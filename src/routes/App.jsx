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
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Không dùng layout */}
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

        {/* Dùng layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:productId" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Account route layout */}
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notification" element={<Notification />} />
            <Route path="orders" element={<Order />} />
            <Route path="address" element={<Addresses />} />
            <Route path="voucher" element={<MyVoucher />} />

            {/*<Route path="favorites" element={<Favorites />} />
            <Route path="change-password" element={<ChangePassword />} />  */}
          </Route>
        </Route>

        <Route
          path="/staff/*"
          element={
            <PrivateRoute roles={["STAFF"]}>
              <StaffLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<StaffHome />} />
          {/* <Route path="orders" element={<StaffOrders />} /> */}
        </Route>
        {/* Route không tồn tại */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
