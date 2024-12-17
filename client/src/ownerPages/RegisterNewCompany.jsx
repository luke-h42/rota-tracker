import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterNewCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const registerCompany = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { companyName, adminName, adminEmail, adminPassword } = data;

    try {
      const { data } = await axios.post("/api/admin/register-company", {
        companyName,
        adminName,
        adminEmail,
        adminPassword,
      });
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setData({
          companyName: "",
          adminName: "",
          adminEmail: "",
          adminPassword: "",
        });
        setIsLoading(false);
        toast.success("Company and admin registered successfully");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Company registration failed, please try again"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className=" px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4 ">
          Company registration
        </h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              name="name"
              className="block text-sm font-medium mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) =>
                setData({ ...data, companyName: e.target.value })
              }
              id="company-name"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the company name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="admin-name"
              name="admin-name"
              className="block text-sm font-medium mb-2"
            >
              Admin Name
            </label>
            <input
              type="text"
              value={data.adminName}
              onChange={(e) => setData({ ...data, adminName: e.target.value })}
              id="admin-name"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the Admin's name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium  mb-2"
            >
              Admin Email
            </label>
            <input
              type="email"
              name="admin-email"
              value={data.adminEmail}
              onChange={(e) => setData({ ...data, adminEmail: e.target.value })}
              id="admin-email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your email for the admin"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="admin-password"
              name="admin-password"
              className="block text-sm font-medium mb-2"
            >
              Admin Password
            </label>
            <input
              type="password"
              value={data.adminPassword}
              onChange={(e) =>
                setData({ ...data, adminPassword: e.target.value })
              }
              id="admin-password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter the admin password"
              required
            />
          </div>

          <button
            type="submit"
            onClick={registerCompany}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Registering company..." : "Register Company"}
          </button>
        </form>
      </div>
    </div>
  );
}
