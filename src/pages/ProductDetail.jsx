import { useParams } from "react-router-dom";

import products from "@/mockData/products";
import categories from "@/mockData/categories";

import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

const ProductDetail = () => {
  const { slug } = useParams();

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return <div className="py-20 text-center">Không tìm thấy sản phẩm</div>;
  }

  const category = categories.find(
    (item) => item.category_id === product.category_id,
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-360 mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm font-semibold">
          Trang chủ &gt; Thực đơn &gt; {category?.name} &gt; {product.name}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <ProductGallery product={product} />

          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
