import ButtonCustom from "@/components/ButtonCustom";
import Category from "@/components/home/Category";
import ProductList from "@/components/home/ProductList";
import Slide from "@/components/home/Slide";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useFetch } from "@/hook/customHook";
import { useDispatch } from "react-redux";
import { fetchAllProduct } from "@/store/slices/productSlice";
import ulti from "@/ultis/ulti";
import PromotionSlideshow from "@/components/home/PromotionSlideShow";

const Home = () => {
  // fetch products best seller, newest
  const dispatch = useDispatch();

  const {
    data: { products },
    loading,
  } = useFetch(
    async () => {
      const products = await dispatch(fetchAllProduct()).unwrap();
      return { products };
    },
    { initialData: { products: [] } },
  );

  // best seller
  const productBestSale = [...products]
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 8)
    .map((item) => ({
      ...item,
      isHot: item.soldQuantity > 100,
      label: "Bán chạy",
      slug: ulti.slugify(item.name),
    }));

  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map((item) => ({
      ...item,
      slug: ulti.slugify(item.name),
    }));

  // handle swipper
  const swiperRef = useRef(null);

  const bgColor = "#FFF8E8";

  return (
    <div>
      {/* Slide */}
      {/* Slide sử dụng thư viện SWIPER để handle*/}
      {/* Sticky top và z-index ẩn phía sau khi thao tác cuộn chuột */}
      <section className="sticky h-[70vh] top-0 ">
        <Slide></Slide>
      </section>

      {/* Phần content hiện có z-index cao hơn slide để lên trên slide khi cuộn chuột */}
      <section className="relative z-10  bg-white">
        {/* Danh mục bánh  */}
        {/* Sử dụng thư việc SWIPER đẻ handle loop pagination của phần danh mục */}
        <div className="py-20">
          <Category></Category>
        </div>

        <PromotionSlideshow></PromotionSlideshow>

        {/* Sản phẩm bán chạy */}
        {/* Sử dụng Card shadcn và truyền props vào component ProductList */}
        <div className=" py-20">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="font-bold text-2xl text-[#6B4E41]">
                Sản phẩm bán chạy
              </div>
              <Link to="/" className="font-light text-base">
                Xem tất cả
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {loading ? (
                <div className="mx-auto py-4" key={0}>
                  Đang tải dữ liệu sản phẩm...
                </div>
              ) : (
                productBestSale.map((value) => (
                  <div
                    className="basis-[calc(25%-12px)] shrink-0 flex"
                    key={value.id}
                  >
                    <ProductList data={value} key={value.id}></ProductList>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* BLog */}
        <div className="py-20 " style={{ backgroundColor: bgColor }}>
          <div className="container mx-auto">
            <div className="text-4xl mb-10 text-center font-bold text-[#000000]">
              “Mỗi chiếc bánh không chỉ mang hương vị,
              <br />
              Mà còn lưu giữ những khoảnh khắc ngọt ngào.”
            </div>
            <div className="flex justify-center gap-4 w-[75%] mx-auto ">
              <div className="w-[30%] rounded-3xl border aspect-square"></div>
              <div className="w-[70%]">
                <div className="text-md mb-8 leading-loose text-justify text-[#7A6A5C]">
                  Chỉ với vài nguyên liệu cơ bản như bột mì, trứng, sữa và một
                  chút kiên nhẫn, bạn đã có thể tạo nên những chiếc bánh thơm
                  mềm ngay tại căn bếp nhỏ của mình.Từ bánh bông lan, cookies
                  cho đến cupcake, mỗi công thức đều mang theo cảm giác ấm áp và
                  niềm vui giản dị của việc tự tay tạo nên hương vị yêu thích.
                  Không cần kỹ thuật quá phức tạp, điều quan trọng nhất vẫn là
                  sự chăm chút trong từng bước làm. Một chiếc bánh ngon không
                  chỉ nằm ở công thức, mà còn ở cảm xúc được gửi gắm trong đó.
                </div>
                <Link to="/blog">
                  <ButtonCustom
                    name="Xem thêm"
                    color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
                    size="xl"
                  ></ButtonCustom>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm mới */}
        {/* Sử dụng Card shadcn và truyền props vào component ProductList */}
        <div className="py-20">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="font-bold text-2xl text-[#6B4E41]">
                Sản phẩm mới
              </div>
              <Link to="/" className="font-light text-base">
                Xem tất cả
              </Link>
            </div>
            <div className="py-5">
              <Swiper
                modules={[Navigation]}
                navigation
                centeredSlides
                loop={true}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                  1440: {
                    slidesPerView: 5,
                  },
                }}
                className="h-full [--swiper-navigation-color:#000000] shrink-0 flex"
              >
                {newProducts.map((product, index) => (
                  <SwiperSlide
                    key={product.id}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                  >
                    <ProductList data={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* Sale đăng ký */}
        <div
          className="py-20 container mx-auto rounded-4xl"
          style={{ backgroundColor: bgColor }}
        >
          <div className=" mx-20 ">
            <div className="flex gap-4 ">
              <div className="w-[50%] leading-loose flex flex-col gap-4 items-start justify-center">
                <p className="text-5xl font-semibold text-[#000000]">
                  Đăng ký thành viên
                </p>
                <p className="text-[#FF7A00] text-4xl font-semibold">
                  để nhận ưu đãi
                </p>
                <p className="text-lg text-[#7A6A5C]">
                  Đăng ký ngay để tích điểm và nhận ưu đãi sớm nhất.
                </p>
                <div className="">
                  {/* Sử dụng Button Shadcn và custom button component */}
                  <ButtonCustom
                    size="1xl"
                    name="Đăng ký ngay"
                    color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
                  ></ButtonCustom>
                </div>
              </div>
              <div className="w-[50%] rounded-3xl bg-[#F3D7A1] aspect-[2/1]"></div>
            </div>
          </div>
        </div>

        {/* Chương trình sự kiện ưu đãi */}
        <div className="py-20">
          <div className="container mx-auto">
            <div className="text-2xl font-bold text-center text-[#6B4E41] ">
              Ưu đãi & sự kiện
            </div>
            <div className="flex my-6">
              <div className="w-1/3 aspect-[2/1] border border-[#F3D7A1]"></div>
              <div className="w-1/3 aspect-[2/1] border border-[#F3D7A1]"></div>
              <div className="w-1/3 aspect-[2/1] border border-[#F3D7A1]"></div>
            </div>
            <div className="mb-6 text-center text-[#FF7A00] text-2xl font-bold">
              Xem tất cả ưu đãi & sự kiện
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
