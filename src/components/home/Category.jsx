import { Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

const Category = () => {
  const categories = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: "Đồ ăn",
  }));

  return (
    <div className="container mx-auto">
      <div className="text-2xl font-bold text-[#6B4E41] ">Danh mục</div>
      <div className="mt-6 flex flex-wrap mx-30">
        <Swiper
          modules={[Navigation]}
          navigation
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1440: {
              slidesPerView: 5,
            },
          }}
          className=" h-full [--swiper-navigation-color:#000] category-swiper"
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="text-center">
                <div
                  className="mx-auto mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FFF8E8" }}
                >
                  i
                </div>

                <div className="font-light">
                  {item.name} {item.id}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Category;
