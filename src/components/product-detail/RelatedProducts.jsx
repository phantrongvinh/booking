import { useEffect, useState } from "react";

import productAPI from "@/api/productAPI";

import ProductCard from "../menu/ProductCard";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const data = await productAPI.fetchProductByCategory(
          currentProduct.categoryId,
        );

        const filteredProducts = data
          .filter((item) => item.productId !== currentProduct.productId)
          .slice(0, 3);

        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error);
      }
    };

    if (currentProduct?.categoryId) {
      loadRelatedProducts();
    }
  }, [currentProduct]);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Món liên quan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
