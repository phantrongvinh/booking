import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };
  return (
    <Card className="bg-[#F3E7CD] rounded-[24px] border-none">
      <CardContent className="p-6 flex flex-col h-full">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="text-3xl font-bold text-orange-500 mb-6">
            {product.price.toLocaleString("vi-VN")}đ
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 rounded-full h-12 text-black font-bold"
            >
              <ShoppingCart />
              Thêm vào giỏ hàng
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
