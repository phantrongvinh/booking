import { useEffect, useState } from "react";
import productAPI from "@/api/productAPI";
import ProductCard from "../menu/ProductCard";

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productAPI.fetchProduct();

        const shuffled = [...data].sort(() => Math.random() - 0.5);

        setProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Có thể bạn sẽ thích</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
