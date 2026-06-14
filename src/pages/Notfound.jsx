import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="container flex justify-center items-center flex-col py-20 mx-auto h-[100vh] ">
      <div className="text-5xl font-bold leading-loose">NOT FOUND</div>
      <div className="text-3xl leading-loose">
        Ôi không bạn vào nhầm trang rồi, bấm vào
        <Link to="/" className="text-[#FFC13B] mx-2 font-semibold">
          đây
        </Link>
        để về trang chủ nha trang chủ
      </div>
    </div>
  );
};

export default Notfound;
