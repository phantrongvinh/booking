import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import cartAPI from "@/api/cartAPI";
import ulti from "@/ultis/ulti";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await cartAPI.addToCart({
        productId: product.productId,
        quantity: 1,
      });

      // Sau này có thể hiện toast thành công
      console.log("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/menu/${product.productId}`)}
      className="w-full overflow-hidden rounded-[24px] border border-black bg-[#d9d9d9] hover:shadow-md transition cursor-pointer"
    >
      <CardHeader className="p-0 relative">
        <div className=" aspect-square w-full bg-[#6f4e4e] border-b border-black">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {product.salePrice && product.salePrice < product.price && (
          <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{Math.round((1 - product.salePrice / product.price) * 100)}%
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-bold text-base line-clamp-2 min-h-12">
          {product.name}
        </h3>

        <div className="mt-3 flex items-start justify-between">
          <span className="font-bold text-lg text-orange-500">
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
          </span>

          <div className="flex items-center gap-2">
            <Button className="bg-[#FF3A3A] hover:bg-red-600 text-white rounded-full border border-black">
              Đặt ngay
            </Button>

            <Button
              size="icon"
              onClick={handleAddToCart}
              className="bg-[#AEFF00] hover:bg-[#9be500] text-black rounded-full border border-black"
            >
              <ShoppingCart size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
