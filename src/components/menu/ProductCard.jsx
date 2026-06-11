import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Card className="w-full max-w-75.5 rounded-[24px] border border-black  bg-[#d9d9d9] overflow-hidden p-0">
      <div className="h-47.5 w-full bg-[#6f4e4e] rounded-[23px] border border-black">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="h-24.75 px-4 py-3 flex flex-col justify-between">
        <h3 className="font-bold text-[16px] leading-tight">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[16px]">
              {(product.price / 1000).toLocaleString("vi-VN")}k
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button className="bg-[#FF3A3A] hover:bg-red-600 text-white font-bold text-[12px] w-25 h-6.75 rounded-full border border-black shadow-none">
              Đặt ngay
            </Button>

            <Button
              size="icon"
              className="bg-[#AEFF00] hover:bg-[#9be500] text-black w-12.5 h-12.5 rounded-full border border-black shadow-none"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
