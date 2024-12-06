import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
function AdminDashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex items-center flex-col min-h-svh pt-[72px]  bg-white text-black text-center">
      <div className="mb-4">
        <h1 className="text-5xl ">Admin Dashboard</h1>
        {!!user && <h2 className="text-3xl ">Hi {user.name}!</h2>}
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4 max-w-4xl">
          <Link to="/manage-users">
            <button className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out border border-royal-blue-500">
              Manage Users
            </button>
          </Link>

          <button className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out border border-royal-blue-500">
            Button 2
          </button>

          <button className="bg-white text-black p-4 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out border border-royal-blue-500">
            Button 3
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;