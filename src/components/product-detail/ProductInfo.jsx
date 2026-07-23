import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import cartAPI from "@/api/cartAPI";
import ulti from "@/ultis/ulti";

const ProductInfo = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await cartAPI.addToCart({
        productId: product.productId,
        quantity: 1,
      });

      // Sau này có thể hiện toast thành công ở đây
      console.log("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Card className="bg-[#F3E7CD] rounded-[24px] border-none">
      <CardContent className="p-6 flex flex-col h-full">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2 text-sm text-slate-500 text-[#8A6852] line-clamp-2">
            Size: {product.sizeName}
          </p>
        </div>

        <div className="mt-auto">
          <div className="text-3xl font-bold text-orange-500 mb-6">
            {product.salePrice && product.salePrice < product.price ? (
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-[#FF7A00]">
                  {ulti.formatVND(product.salePrice)}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {ulti.formatVND(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#FF7A00]">
                {ulti.formatVND(product.price)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="w-full bg-orange-500 hover:bg-orange-600 rounded-full h-12 text-black font-bold"
            >
              <ShoppingCart />
              {product.stockQuantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-full h-12 font-bold border-black"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfo;
