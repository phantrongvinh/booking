import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

const NewHeader = () => {
  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Thực đơn", to: "/menu" },
    { label: "Mini Game", to: "/mini-game" },
    { label: "Tin tức", to: "/tin-tuc" },
  ];
  return (
    <>
      <div className="py-1 bg-[#C8A27A] text-[#fff] text-base">
        <div className=" container mx-auto">
          <div className=" mx-50 flex justify-between">
            <div className="font-semibold">Hotline: 000 0000 000</div>
            <div className="flex justify-between gap-4">
              <div>About us</div>
              <div>Địa chỉ</div>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-0 py-4 bg-[#fff] z-[999] border">
        <div className="container mx-auto  grid grid-cols-3">
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
                className="text-lg font-bold text-[#6B4E41] hover:text-[#9C7B5B] transition-colors"
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
    </>
  );
};

export default NewHeader;
