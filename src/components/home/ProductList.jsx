import ulti from "@/ultis/ulti";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import ButtonCustom from "../ButtonCustom";

const ProductList = ({ data }) => {
  return (
    <Card className="basis-[calc(25%-12px)] mb-2 border border-[#FFF8E8] overflow-hidden rounded-2xl cursor-pointer hover:shadow-md transition">
      <CardHeader className="p-0 bg-[#FFF8E8] h-80 flex items-center justify-center ">
        <img src="" alt="" className="object-contain" />
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-[#7A5C4E]">{data.name}</h3>

        <p className="mt-2 text-sm text-slate-500 text-[#8A6852]">
          {data.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#A67C52]">
            {ulti.formatVND(data.price)}
          </span>

          <ButtonCustom name="Mua" size="lg"></ButtonCustom>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
