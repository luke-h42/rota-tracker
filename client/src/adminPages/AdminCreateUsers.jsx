import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminCreateUsers({ onClose, fetchUsers }) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { userName, userEmail, userPassword } = data;
    if (!userName || !userEmail || !userPassword) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/admin/register-user",
        {
          userName,
          userEmail,
          userPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setData({
          userName: "",
          userEmail: "",
          userPassword: "",
        });
        setIsLoading(false);
        toast.success("User registered successfully");
        fetchUsers();
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "User registration failed, please try again"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Register a new user
        </h1>

        <form>
          <div className="flex gap-2 items-center mb-2">
            <h1 className="text-sm sm:text-base">
              You are adding a user to the company:{" "}
              <span className="underline">
                {user?.companyName || "No company"}
              </span>
            </h1>
          </div>
          <div className="mb-4">
            <label
              htmlFor="user-name"
              name="user-name"
              className="block text-sm font-medium mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              value={data.userName}
              onChange={(e) => setData({ ...data, userName: e.target.value })}
              id="user-name"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the user's name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="user-email"
              className="block text-sm font-medium mb-2"
            >
              User Email
            </label>
            <input
              type="email"
              name="user-email"
              value={data.userEmail}
              onChange={(e) => setData({ ...data, userEmail: e.target.value })}
              id="user-email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the email for the user"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="user-password"
              name="user-password"
              className="block text-sm font-medium mb-2"
            >
              User Password
            </label>
            <input
              type="password"
              value={data.userPassword}
              onChange={(e) =>
                setData({ ...data, userPassword: e.target.value })
              }
              id="user-password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the user password"
              required
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              registerUser(e);
            }}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Registering user..." : "Register user"}
          </button>
        </form>
      </div>
    </div>
  );
}
