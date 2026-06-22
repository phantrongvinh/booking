import products from "@/mockData/products";
import ProductCard from "../menu/ProductCard";

const RelatedProducts = ({ currentProduct }) => {
  const relatedProducts = products
    .filter(
      (item) =>
        item.category_id === currentProduct.category_id &&
        item.product_id !== currentProduct.product_id,
    )
    .slice(0, 3);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Món liên quan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
