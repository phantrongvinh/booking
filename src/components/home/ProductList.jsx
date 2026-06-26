import ulti from "@/ultis/ulti";
import { Card, CardContent, CardHeader } from "../ui/card";
import ButtonCustom from "../ButtonCustom";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = ({ data }) => {
  return (
    <Card className="border border-[#FFF8E8] overflow-hidden rounded-2xl hover:shadow-md transition">
      <CardHeader className="p-0 h-80 flex items-center justify-center relative ">
        {data.label && (
          <div className="bg-[#FFD21F] py-1 px-2 rounded-2xl absolute top-0 left-0 m-4">
            {data.label}
          </div>
        )}

        <img
          src={data.imageUrl}
          alt={data.name}
          className="h-full w-full object-cover "
        />
      </CardHeader>

      <CardContent className="p-4">
        <Link to={`/product/${data.slug}?id=${data.productId}`}>
          <h3 className="text-xl font-bold text-[#000000] hover:text-[#FF7A00] transition-colors">
            {data.name}
          </h3>

          <p className="mt-2 text-sm text-slate-500 text-[#8A6852]">
            {data.description}
          </p>
        </Link>

        <div className="mt-4  items-center ">
          <span className="text-xl font-bold text-[#FF7A00]">
            {ulti.formatVND(data.price)}
          </span>
        </div>
        <div className="flex justify-between mt-2">
          <ButtonCustom
            name="Mua ngay"
            size="lg"
            color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] transition-colors"
          ></ButtonCustom>
          <div className="border border-[#FF7A00] text-[#FF7A00] rounded-full p-2 hover:bg-[#FF7A00] hover:text-[#FFF000] cursor-pointer transition-colors">
            <ShoppingBag />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
