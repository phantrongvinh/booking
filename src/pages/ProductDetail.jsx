import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import productAPI from "@/api/productAPI";

import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await productAPI.fetchProductById(productId);

        setProduct(data || null);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        ⏳ Đang tải sản phẩm...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <div className="py-20 text-center text-gray-500">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-360 mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <div className="mb-6 text-sm font-semibold">
          <h3 className="text-base font-bold ml-3">
            Trang chủ &gt; Thực đơn &gt; {product.categoryName} &gt;{" "}
            {product.name}
          </h3>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {/* RELATED */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
