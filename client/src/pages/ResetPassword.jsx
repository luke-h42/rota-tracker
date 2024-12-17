import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Passwords must be at least 6 characters");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-black mt-[20vh] md:mt-[25vh]">
      <div className="bg-white rounded-lg px-8 py-6 max-w-md w-full items-center justify-center">
        <div className="w-full p-4 flex flex-col justify-center items-center gap-2">
          <h1 className="text-lg">Resetting Password</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full ">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
