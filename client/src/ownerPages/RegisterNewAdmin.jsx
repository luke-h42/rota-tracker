import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterNewAdmin() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/admin/get-company-list"); // Call backend API to get companies
        setCompanies(response.data); // Set the companies data to state
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setData((prevData) => ({ ...prevData, companyName: companyId }));
  };

  const registerAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let { companyName, adminName, adminEmail, adminPassword } = data;
    adminEmail = adminEmail.toLowerCase();
    if (adminPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(adminEmail)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/admin/register-admin", {
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
        setSelectedCompany("");
        setIsLoading(false);
        toast.success("Admin registered successfully");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Admin registration failed, please try again"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black pt-[72px]">
      <div className="px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Register a company admin
        </h1>

        <form>
          <div className="flex gap-2 items-center">
            <label htmlFor="company">Select a Company:</label>
            <select
              id="company"
              name="company"
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="border mt-2 p-2"
            >
              <option value="">-- Select --</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
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
              className="block text-sm font-medium mb-2"
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
            onClick={registerAdmin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Registering admin..." : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
