import ProductCard from "./ProductCard";

const products = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: "Tên món ăn",
  price: 999999,
  image: "",
}));

const ProductGrid = () => {
  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6.25 w-full justify-items-center">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <button className="mt-4 bg-[#ccff00] hover:bg-[#b5e600] text-black font-bold text-[15px] px-16 py-3 rounded-[30px] border border-black shadow-sm transition-all min-w-62.5">
        Xem thêm
      </button>
    </div>
  );
};

export default ProductGrid;
