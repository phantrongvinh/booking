import { useState } from "react";
import products from "@/mockData/products";
import ProductCard from "../menu/ProductCard";

const RecommendedProducts = () => {
  const [randomProducts] = useState(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 3);
  });

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Có thể bạn sẽ thích</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
