import { useMemo, useState } from "react";
import SidebarFilter from "@/components/menu/SidebarFilter";
import ProductGrid from "@/components/menu/ProductGrid";
import products from "@/mockData/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Menu = () => {
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((item) => item.category_id === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      default:
        break;
    }

    return result;
  }, [sortBy, selectedCategory]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-360 mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold ml-3">Trang chủ &gt; Thực đơn</h2>

          <Select onValueChange={setSortBy}>
            <SelectTrigger className="w-45 h-10 rounded-full border border-[#D4C4A8] bg-[#FFF8EA]">
              <SelectValue placeholder="Lọc theo: giá" />
            </SelectTrigger>

            <SelectContent className="z-50 bg-white" position="popper">
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              <SelectItem value="name-asc">Tên A → Z</SelectItem>
              <SelectItem value="name-desc">Tên Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          <SidebarFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
