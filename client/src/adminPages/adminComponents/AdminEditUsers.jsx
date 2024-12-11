import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminEditUsers({ onClose, fetchUsers, userId }) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    name: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/admin/user/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateUser = async (e) => {
    e.preventDefault();

    const payload = {
      userId: userId,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    };
    try {
      const response = await axios.put(`/api/admin/user/${userId}`, payload);
      if (response.status === 200) {
        toast.success("User updated successfully!");
        onClose();
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading User info...</p>
      ) : (
        <>
          <div className="flex items-center justify-center w-full text-black">
            <div className="px-4 py-6 max-w-full w-full sm:max-w-md">
              <h1 className="text-2xl font-bold text-center mb-4">
                Editing existing user
              </h1>

              <form>
                <div className="flex gap-2 items-center mb-2">
                  <h1 className="text-sm sm:text-base">
                    You are editing a user of the company: <br />
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
                    name="name"
                    value={data.name}
                    onChange={handleChange}
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
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    id="user-email"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    placeholder="Enter the email for the user"
                    required
                  />
                </div>
                <div className="mb-4 flex gap-4 items-center">
                  <label htmlFor="active-status">Choose user status:</label>
                  <select
                    id="active-status"
                    name="status"
                    value={data.status}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg p-2.5 "
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    updateUser(e);
                  }}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? "Updating user..." : "Update user"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
