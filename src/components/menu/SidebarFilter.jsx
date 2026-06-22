import categories from "@/mockData/categories";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Menu, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SidebarFilter = ({ selectedCategory, setSelectedCategory }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  return (
    <Card className="w-65 h-fit self-start rounded-[32px] bg-[#F9F8F6] px-6 py-6">
      {/* Thực đơn */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Menu size={24} />
          <h3 className="text-[20px] font-bold">Thực đơn</h3>
        </div>

        <div className="space-y-2">
          {/* Tất cả */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedCategory === null}
              onCheckedChange={() => setSelectedCategory(null)}
            />

            <label className="font-medium cursor-pointer">Tất cả</label>
          </div>

          {(showAllCategories ? categories : categories.slice(0, 5)).map(
            (item) => (
              <div key={item.category_id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCategory === item.category_id}
                  onCheckedChange={() => setSelectedCategory(item.category_id)}
                />

                <label className="font-medium cursor-pointer">
                  {item.name}
                </label>
              </div>
            ),
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="w-full mt-2 flex items-center justify-center gap-1 text-[16px] font-semibold text-black hover:bg-transparent hover:text-black"
        >
          {showAllCategories ? "Thu gọn" : "Xem thêm"}

          <ChevronDown
            size={18}
            className={`transition-transform ${
              showAllCategories ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <Separator className="my-4 bg-black/30" />

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

      <Separator className="my-4 bg-black/30" />

      {/* Banner */}
      <div className="h-100 rounded-[40px] border border-[#F2C94C] bg-[#FDF5DE] flex items-center justify-center">
        <span className="text-3xl font-bold">BANNER</span>
      </div>
    </Card>
  );
};

export default SidebarFilter;
