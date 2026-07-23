import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Circle, Clock } from "lucide-react";
import {
  getPromotion,
  getPromotionOngoing,
} from "@/store/slices/promotionSlice";
import { useFetch } from "@/hook/customHook";
import ulti from "@/ultis/ulti";

const PromotionSlideshow = () => {
  const dispatch = useDispatch();
  const { promotionOngoing = [] } = useSelector((state) => state.promotion);
  const [cur, setCur] = useState(0);

  useFetch(
    () => {
      dispatch(getPromotionOngoing()).unwrap();
    },
    { immediate: true },
  );

  const active = promotionOngoing.filter((p) => p.status === "active");

  const goTo = useCallback(
    (n) => {
      setCur((n + active.length) % active.length);
    },
    [active.length],
  );

  // Auto-play
  useEffect(() => {
    if (active.length < 2) return;
    const t = setInterval(() => goTo(cur + 1), 7000);
    return () => clearInterval(t);
  }, [cur, goTo, active.length]);

  if (active.length === 0) return null;

  const p = active[cur];

  return (
    <div className="overflow-hidden rounded-2xl container mx-auto">
      {/* Slide */}
      <div className="relative h-72 md:h-80">
        {p.bannerUrl ? (
          <img
            src={p.bannerUrl}
            alt={p.title}
            className="h-full w-full object-cover rounded-2xl"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-400 to-amber-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              p.isOngoing
                ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/30"
                : "bg-amber-500/25 text-amber-300 border border-amber-400/30"
            }`}
          >
            {p.isOngoing ? (
              <>
                <Circle className="h-2 w-2 fill-current" /> Đang chạy
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" /> Sắp diễn ra
              </>
            )}
          </span>
          <h3 className="text-xl font-bold text-white">{p.title}</h3>
          <p className="mt-1 text-sm text-white/70">{p.content}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-full bg-[#FA8C00] px-3 py-1 text-sm font-bold text-white">
              Giảm{" "}
              {p.discountType === "percent"
                ? `${p.discountValue}%`
                : `${ulti.formatVND(p.discountValue)}`}
            </span>
            <span className="text-xs text-white/60">
              {ulti.formatDate(new Date(p.startDate))} →{" "}
              {ulti.formatDate(new Date(p.endDate))}
            </span>
          </div>
        </div>

        {/* Nav buttons */}
        {active.length > 1 && (
          <>
            <button
              onClick={() => goTo(cur - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm hover:bg-black/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goTo(cur + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm hover:bg-black/40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {active.length > 1 && (
        <div className="flex justify-center gap-1.5 bg-white py-3">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === cur ? "w-5 bg-[#FA8C00]" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Product strip */}
      {p.products?.length > 0 && (
        <>
          <p className="border-t border-[#FFE7BA] px-4 pt-3 text-xs font-semibold text-gray-500">
            Sản phẩm áp dụng
          </p>
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 pt-2 scrollbar-none">
            {p.products.map((prod) => (
              <div
                key={prod.productId}
                className="min-w-[100px] shrink-0 rounded-xl border border-[#FFE7BA] overflow-hidden"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.productName}
                  className="h-16 w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-[#5B3A0A]">
                    {prod.productName}
                  </p>
                  <p className="text-[11px] text-gray-400 line-through">
                    {prod.price?.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-xs font-semibold text-[#FA8C00]">
                    {prod.salePrice?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromotionSlideshow;
