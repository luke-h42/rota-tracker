import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <div className="flex-grow ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
