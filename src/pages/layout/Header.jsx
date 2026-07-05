import { useFetch } from "@/hook/customHook";
import { logout } from "@/store/slices/authSlice";
import { fetchMe } from "@/store/slices/userSlice";
import {
  LayoutDashboard,
  LogOut,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import productAPI from "../../api/productAPI";
import { debounce } from "lodash";
const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Thực đơn", to: "/menu" },
  { label: "Mini Game", to: "/mini-game" },
  { label: "Tin tức", to: "/tin-tuc" },
  { label: "Blog", to: "/blog" },
];

export default function Header() {
  const { isLoggedIn, isAdmin, isStaff } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const searchProduct = useMemo(
    () =>
      debounce(async (value) => {
        if (!value.trim()) {
          setProducts([]);
          return;
        }

        try {
          const data = await productAPI.fetchProductBySearch(value);
          setProducts(data);
        } catch (error) {
          console.error(error);
        }
      }, 300),
    [],
  );
  useEffect(() => {
    return () => {
      searchProduct.cancel();
    };
  }, [searchProduct]);
  // Click outside để đóng dropdown
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    console.log(isLoggedIn);
  });
  const handleSearch = (e) => {
    const value = e.target.value;
    setKeyword(value);

    searchProduct(value);
  };

  const {
    data: { user },
    loading,
  } = useFetch(
    async () => {
      const user = await dispatch(fetchMe()).unwrap();
      return { user };
    },
    {
      initialData: { user: null },
    },
  );
  return (
    <>
      <div className="py-1 bg-[#FFC13B]">
        <div className="container mx-auto flex justify-around items-center">
          <div className="font-bold text-sm">Hotline: 000 000 000</div>
          <div className="font-bold text-sm flex gap-3">
            <div className="">Về chúng tôi</div>
            <div className="">Địa chỉ</div>
          </div>
        </div>
      </div>
      <header className="w-full sticky top-0 z-[999]">
        <div className="bg-[#FFF8E8]">
          <div className="container mx-auto py-2 grid grid-cols-3">
            {/* Logo - Đã cập nhật link ảnh */}
            <div className="shrink-0">
              <Link to="/">
                <img
                  src="https://i.ibb.co/v47yVGfx/logo.png"
                  alt="Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Nav - flex-1 và justify-center giúp căn giữa menu */}
            <nav className="flex-1 flex justify-center items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-lg font-bold text-[#2B1B12] hover:text-[#9C7B5B] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center justify-end gap-4 shrink-0">
              {/* Chỉnh max-w-[250px] thành giá trị lớn hơn để ô dài ra */}
              <div className="relative w-full max-w-[300px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={keyword}
                  onChange={handleSearch}
                  className="w-full h-9 rounded-full bg-white pl-5 pr-12 text-sm text-[#2B1B12] border border-[#F3D7A1] focus:outline-none"
                />
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2B1B12]"
                />

                {products.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {products.map((item) => (
                      <div
                        key={item.productId}
                        onClick={() => {
                          setKeyword("");
                          setProducts([]);
                          navigate(`/product/${item.productId}`);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />

                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-orange-500">
                            {item.price.toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link to="/cart">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B1B12] text-[#2B1B12] hover:bg-[#FFC13B]/30 transition-colors">
                    <ShoppingBag size={20} />
                  </button>
                </Link>

                {!isLoggedIn ? (
                  <Link
                    to="/auth"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B1B12] text-[#2B1B12] hover:bg-[#FFC13B]/30 transition-colors"
                  >
                    <User size={20} />
                  </Link>
                ) : (
                  <div className="relative" ref={ref}>
                    <button
                      onClick={() => setOpen((v) => !v)}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B1B12] text-[#2B1B12] hover:bg-[#FFC13B]/30 transition-colors"
                    >
                      <User size={20} />
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        {/* Tên user */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-[#2B1B12] truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>

                        {/* Hồ sơ cá nhân */}
                        <Link
                          to="/account/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[#2B1B12] hover:bg-[#FFC13B]/20 transition-colors"
                        >
                          <User size={16} />
                          Hồ sơ cá nhân
                        </Link>

                        {isAdmin ? (
                          <Link
                            to="/admin"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#2B1B12] hover:bg-[#FFC13B]/20 transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Trang quản trị
                          </Link>
                        ) : (
                          isStaff && (
                            <Link
                              to="/staff"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-[#2B1B12] hover:bg-[#FFC13B]/20 transition-colors"
                            >
                              <LayoutDashboard size={16} />
                              Thống kê nhân viên
                            </Link>
                          )
                        )}

                        {/* Đăng xuất */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scallop bottom */}
        <div className="relative">
          <div
            className="absolute top-0 left-0 w-full h-6 z-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 0, #FFC13B 12px, transparent 13px)",
              backgroundSize: "24px 24px",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>
      </header>
    </>
  );
}
