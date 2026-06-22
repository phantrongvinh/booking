import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/menu/${product.slug}`} className="block w-full">
      <Card className="w-full overflow-hidden rounded-[24px] border border-black bg-[#d9d9d9] hover:shadow-md transition cursor-pointer">
        <CardHeader className="p-0">
          <div className="aspect-square w-full bg-[#6f4e4e] border-b border-black">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="font-bold text-base line-clamp-2 min-h-12">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-lg text-orange-500">
              {product.price.toLocaleString("vi-VN")}đ
            </span>

            <div className="flex items-center gap-2">
              <Button className="bg-[#FF3A3A] hover:bg-red-600 text-white rounded-full border border-black">
                Đặt ngay
              </Button>

              <Button
                size="icon"
                className="bg-[#AEFF00] hover:bg-[#9be500] text-black rounded-full border border-black"
              >
                <ShoppingCart size={20} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
