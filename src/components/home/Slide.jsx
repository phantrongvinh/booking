import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSiteSettings } from "@/hook/useSettingSite";

const Slide = () => {
  const { slides } = useSiteSettings();

  if (!slides || slides.length === 0) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      className="h-full [--swiper-navigation-color:#ffffff]
                    [--swiper-pagination-color:#ffffff]
                  [--swiper-pagination-bullet-inactive-color:rgba(255,255,255,0.5)]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold">{slide.title}</h1>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slide;
