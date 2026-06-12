import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import NewHeader from "./NewHeader";
import NewFooter from "./NewFooter";

const MainLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <NewHeader />
      <Outlet />
      <NewFooter />
      <Footer />
    </>
  );
};

export default MainLayout;
