import { useState } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(9);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6.25 w-full">
        {visibleProducts.map((item) => (
          <ProductCard key={item.product_id} product={item} />
        ))}
      </div>

      {visibleCount < products.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 9)}
          className="mt-4 bg-[#ccff00] hover:bg-[#b5e600] text-black font-bold text-[15px] px-16 py-3 rounded-[30px] border border-black shadow-sm transition-all min-w-62.5"
        >
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default ProductGrid;
