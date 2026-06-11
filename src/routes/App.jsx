import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Footer from "@/pages/layout/Footer";
import Header from "@/pages/layout/Header";
import Menu from "@/pages/Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/menu" element={<Menu />}></Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
