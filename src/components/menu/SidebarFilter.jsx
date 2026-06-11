import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Menu, Star } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Tất cả", "Nước uống", "Bánh ngọt", "Combo", "Đồ ăn"];

const SidebarFilter = () => {
  return (
    <Card className="w-65 rounded-[32px] bg-[#F9F8F6] px-6">
      {/* Thực đơn */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Menu size={24} />
          <h3 className="text-[20px] font-bold">Thực đơn</h3>
        </div>

        <div className="space-y-2">
          {categories.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Checkbox />
              <label className="font-medium cursor-pointer">{item}</label>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-2 flex items-center justify-center gap-1 text-[16px] font-semibold text-black hover:bg-transparent hover:text-black"
        >
          Xem thêm
          <ChevronDown size={18} />
        </Button>
      </div>

      <Separator className="mb-3 bg-black/30" />

      {/* Đánh giá */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star size={24} />
          <h3 className="text-[20px] font-bold">Đánh giá</h3>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <Checkbox />

              <div className="text-yellow-400 text-lg">
                {"★".repeat(star)}
                <span className="text-gray-400">{"★".repeat(5 - star)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-3 bg-black/30" />

      {/* Banner */}
      <div className="h-100 rounded-[40px] border border-[#F2C94C] bg-[#FDF5DE] flex items-center justify-center">
        <span className="text-3xl font-bold">BANNER</span>
      </div>
    </Card>
  );
};

export default SidebarFilter;
