import SidebarFilter from "@/components/menu/SidebarFilter";
import ProductGrid from "@/components/menu/ProductGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Menu = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-360 mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold ml-3">Trang chủ &gt; Thực đơn</h2>

          <Select>
            <SelectTrigger className="w-45 rounded-full border border-[#D4C4A8] bg-[#FFF8EA]">
              <SelectValue placeholder="Lọc theo: giá" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>

              <SelectItem value="price-desc">Giá giảm dần</SelectItem>

              <SelectItem value="name-asc">Tên A → Z</SelectItem>

              <SelectItem value="name-desc">Tên Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          <SidebarFilter />

          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
