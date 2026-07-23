import ulti from "@/ultis/ulti";
import { Card, CardContent, CardHeader } from "../ui/card";
import ButtonCustom from "../ButtonCustom";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = ({ data }) => {
  const hasSale =
    data.salePrice != null && data.salePrice > 0 && data.salePrice < data.price;

  return (
    <Card className="border border-[#FFF8E8] overflow-hidden rounded-2xl hover:shadow-md transition h-full w-full flex flex-col">
      <CardHeader className="p-0 h-80 flex items-center justify-center relative shrink-0">
        {data.label && (
          <div className="bg-[#FFD21F] py-1 px-2 rounded-2xl absolute top-0 left-0 m-4">
            {data.label}
          </div>
        )}

        <img
          src={data.imageUrl}
          alt={data.name}
          className="h-full w-full object-cover"
        />
        {data.salePrice && data.salePrice < data.price && (
          <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{Math.round((1 - data.salePrice / data.price) * 100)}%
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 flex flex-col flex-1">
        <Link to={`/menu/${data.productId}`}>
          <h3 className="text-xl font-bold text-[#000000] hover:text-[#FF7A00] transition-colors line-clamp-1">
            {data.name}
          </h3>

          <p className="mt-2 text-sm text-slate-500 text-[#8A6852] line-clamp-2">
            {data.description}
          </p>
        </Link>

        <div className="mt-4">
          <p className="mt-2 text-sm text-slate-500 text-[#8A6852] line-clamp-2">
            Size: {data.sizeName}
          </p>
          <div className="mt-4 min-h-[52px] flex flex-col justify-center">
            {hasSale ? (
              <>
                <span className="text-xl font-bold text-[#FF7A00]">
                  {ulti.formatVND(data.salePrice)}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {ulti.formatVND(data.price)}
                </span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-[#FF7A00]">
                  {ulti.formatVND(data.price)}
                </span>

                <span className="text-sm invisible">0</span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-auto pt-2">
          <Link to={`/menu/${data.productId}`}>
            <ButtonCustom
              name="Mua ngay"
              size="lg"
              color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] transition-colors"
            ></ButtonCustom>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
