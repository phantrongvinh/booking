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
  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );

  const pages = chunk(categories, 10);

  return (
    <div className="container mx-auto">
      <div className="text-lg font-bold  ">Danh mục</div>
      <div className="mt-6 flex flex-wrap mx-30">
        <Swiper
          modules={[Navigation]}
          navigation
          loop={pages.length > 1}
          slidesPerView={1}
          className=" h-full [--swiper-navigation-color:#000] category-swiper"
        >
          {pages.map((page, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-5 gap-y-8">
                {page.map((item) => (
                  <div className="text-center" key={item.id}>
                    <div
                      className="mx-auto mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#F3D7A1" }}
                    >
                      i
                    </div>

                    <div className="font-light text-xs">
                      {item.name} {item.id}
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Category;
