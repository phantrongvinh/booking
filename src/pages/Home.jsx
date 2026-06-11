import Category from "@/components/home/Category";
import Slide from "@/components/home/Slide";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Slide */}
      <section className="sticky h-[70vh] top-0 ">
        <Slide></Slide>
      </section>

      {/* Danh mục bánh */}
      <section className="relative z-10  bg-white">
        <div className="py-20" style={{ backgroundColor: "#FFF8E8" }}>
          <Category></Category>
        </div>
        <div className="mb-20 py-20">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="font-bold">Sản phẩm nổi bật</div>
              <Link to="/" className="font-light text-sm">
                Xem tất cả
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
