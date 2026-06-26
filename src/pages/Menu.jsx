import { useEffect, useMemo, useState } from "react";

import SidebarFilter from "@/components/menu/SidebarFilter";
import ProductGrid from "@/components/menu/ProductGrid";

import productAPI from "@/api/productAPI";
import categoryAPI from "@/api/categoryAPI";

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

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= FETCH INIT DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productsData, categoriesData] = await Promise.all([
          productAPI.fetchProduct(),
          categoryAPI.fetchCategory(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ================= SORT =================
  const sortedProducts = useMemo(() => {
    const result = [...products];

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
  }, [products, sortBy]);

  // ================= CATEGORY FILTER =================
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);

    try {
      setLoading(true);

      if (!categoryId) {
        const data = await productAPI.fetchProduct();
        setProducts(data);
      } else {
        const data = await productAPI.fetchProductByCategory(categoryId);
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-360 mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-bold ml-3">Trang chủ &gt; Thực đơn</h2>

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

        {/* CONTENT */}
        <div className="flex gap-6">
          <SidebarFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                ⏳ Đang tải sản phẩm...
              </div>
            ) : (
              <ProductGrid products={sortedProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
