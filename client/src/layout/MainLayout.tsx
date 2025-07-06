import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar/Navbar";
import Footer from "../components/shared/footer/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-130px)] dark:bg-black">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;
