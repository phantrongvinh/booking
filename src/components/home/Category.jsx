import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { useFetch } from "@/hook/customHook";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategory } from "@/store/slices/categorySlice";
import { Menu } from "lucide-react";

const Category = () => {
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.category);

  const {
    data: { categories },
    loading,
  } = useFetch(
    async () => {
      const categories = await dispatch(fetchAllCategory()).unwrap();
      return { categories };
    },
    { initialData: { categories: [] } },
  );

  return (
    <div className="container mx-auto">
      <div className="text-2xl font-bold text-[#6B4E41] flex gap-2 items-center">
        Danh mục
      </div>
      <div className="mt-6 flex flex-wrap mx-30 ">
        <Swiper
          key={categories.length}
          modules={[Navigation]}
          navigation
          loop={true}
          slidesPerView={1}
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
          {loading ? (
            <SwiperSlide>
              <div className="mx-auto">Đang tải danh mục...</div>
            </SwiperSlide>
          ) : error ? (
            <SwiperSlide>
              <div className="text-center text-red-500">{error}</div>
            </SwiperSlide>
          ) : (
            categories.map((item) => (
              <SwiperSlide key={item.categoryId}>
                <div className="text-center">
                  <div
                    className="mx-auto mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#FFF8E8" }}
                  >
                    i
                  </div>

                  <div className="font-light">{item.name}</div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Category;
