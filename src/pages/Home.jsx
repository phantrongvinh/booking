import ButtonCustom from "@/components/ButtonCustom";
import Category from "@/components/home/Category";
import ProductList from "@/components/home/ProductList";
import Slide from "@/components/home/Slide";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const productList = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: "Tên bánh",
    description: "Mô tả món ăn",
    price: 200000,
  }));

  const newProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: "Tên bánh",
    description: "Mô tả món ăn",
    price: 200000,
  }));

  return (
    <div>
      {/* Slide */}
      <section className="sticky h-[70vh] top-0 ">
        <Slide></Slide>
      </section>

      {/* Danh mục bánh */}
      <section className="relative z-10  bg-white">
        <div className="py-20 bg-[#FFF8E8]">
          <Category></Category>
        </div>
        <div className=" py-20">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="font-bold text-2xl">Sản phẩm bán chạy</div>
              <Link to="/" className="font-light text-base">
                Xem tất cả
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {productList.map((value) => (
                <ProductList data={value} key={value.id}></ProductList>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 bg-[#FFF8E8]">
          <div className="container mx-auto">
            <div className="text-4xl mb-10">
              “Mỗi chiếc bánh không chỉ mang hương vị, Mà còn lưu giữ những
              khoảnh khắc ngọt ngào.”
            </div>
            <div className="flex justify-center gap-4 w-[75%] mx-auto ">
              <div className="w-[30%] rounded-3xl bg-[#F3D7A1] aspect-square"></div>
              <div className="w-[70%]">
                <div className="text-md mb-8 leading-loose">
                  Chỉ với vài nguyên liệu cơ bản như bột mì, trứng, sữa và một
                  chút kiên nhẫn, bạn đã có thể tạo nên những chiếc bánh thơm
                  mềm ngay tại căn bếp nhỏ của mình.Từ bánh bông lan, cookies
                  cho đến cupcake, mỗi công thức đều mang theo cảm giác ấm áp và
                  niềm vui giản dị của việc tự tay tạo nên hương vị yêu thích.
                  Không cần kỹ thuật quá phức tạp, điều quan trọng nhất vẫn là
                  sự chăm chút trong từng bước làm. Một chiếc bánh ngon không
                  chỉ nằm ở công thức, mà còn ở cảm xúc được gửi gắm trong đó.
                </div>
                <ButtonCustom name="Xem thêm" size="lg"></ButtonCustom>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="font-bold text-2xl">Sản phẩm mới</div>
              <Link to="/" className="font-light text-base">
                Xem tất cả
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {newProducts.map((value) => (
                <ProductList data={value} key={value.id}></ProductList>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 bg-[#FFF8E8]">
          <div className="container mx-auto">
            <div className="flex gap-4 ">
              <div className="w-[50%] leading-loose flex flex-col gap-4 items-end justify-center">
                <p className="text-5xl font-semibold">Đăng ký thành viên</p>
                <p className="text-[#FF7A00] text-4xl font-semibold">
                  để nhận ưu đãi
                </p>
                <p className="text-lg">
                  Đăng ký ngay để tích điểm và nhận ưu đãi sớm nhất.
                </p>
                <div className="">
                  <ButtonCustom size="1xl" name="Đăng ký ngay"></ButtonCustom>
                </div>
              </div>
              <div className="w-[50%] rounded-3xl bg-[#F3D7A1] aspect-[2/1]"></div>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto">
            <div className="text-2xl font-bold text-center ">
              Ưu đãi & sự kiện
            </div>
            <div className="mx-6 flex my-6">
              <div className="w-[33%] bg-[#FFF8E8] aspect-[2/1] border border-[#F3D7A1]"></div>
              <div className="w-[33%] bg-[#FFF8E8] aspect-[2/1] border border-[#F3D7A1]"></div>
              <div className="w-[33%] bg-[#FFF8E8] aspect-[2/1] border border-[#F3D7A1]"></div>
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
