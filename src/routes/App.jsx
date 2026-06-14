import Auth from "@/pages/Auth";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Home from "@/pages/Home";
import MainLayout from "@/pages/layout/MainLayout";
import Menu from "@/pages/Menu";
import Notfound from "@/pages/Notfound";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Không dùng layout */}
        <Route path="/auth" element={<Auth />} />

        {/* Dùng layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>
        {/* Route không tồn tại */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
