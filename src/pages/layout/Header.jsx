import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Thực đơn", to: "/menu" },
  { label: "Mini Game", to: "/mini-game" },
  { label: "Tin tức", to: "/tin-tuc" },
];

export default function Header() {
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
                  placeholder="Tìm kiếm...."
                  className="w-full h-9 rounded-full bg-white pl-5 pr-12 text-sm text-[#2B1B12] border border-[#F3D7A1] focus:outline-none"
                />
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2B1B12]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B1B12] text-[#2B1B12] hover:bg-[#FFC13B]/30 transition-colors">
                  <ShoppingBag size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B1B12] text-[#2B1B12] hover:bg-[#FFC13B]/30 transition-colors">
                  <User size={20} />
                </button>
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
