import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function GetStarted() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [submitted, hasSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = adminEmail.toLowerCase();
    // Basic form validation
    setIsLoading(true);
    if (
      !companyName ||
      !adminName ||
      !adminEmail ||
      !adminPassword ||
      !confirmAdminPassword
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (adminPassword != confirmAdminPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(adminEmail)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (adminPassword.length < 6) {
      toast.error("Passwords must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/get-started", {
        companyName,
        adminName,
        adminEmail: lowerCaseEmail,
        adminPassword,
      });

      if (response.error) {
        toast.error(data.error);
        setIsLoading(false);
      }
      setIsLoading(false);
      hasSubmitted(true);
      toast.success("Company and Admin account registration successful!");
      setCompanyName("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error?.response?.data?.error ||
          "User registration failed, please try again"
      );
    }
  };

  return (
    <section className="flex flex-col gap-10 md:pt-14 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-700 sm:text-4xl">
          Get Started with{" "}
          <span className="text-royal-blue-500"> RotaTrackr</span>
        </h2>
        <p className="mt-4 px-4 text-lg text-gray-600">
          Sign up today and make scheduling your team's work hours easier than
          ever. Get started by creating your company profile and adding an
          admin.
        </p>
        {!submitted ? (
          <>
            {" "}
            <div className=" bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Create Your Company Account
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="Enter your company name..."
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adminName"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      Admin Name
                    </label>
                    <input
                      type="text"
                      id="adminName"
                      name="adminName"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      placeholder="Enter your Admin's name..."
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adminEmail"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      Admin Email
                    </label>
                    <input
                      type="email"
                      id="adminEmail"
                      name="adminEmail"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      placeholder="Enter your Admin's email..."
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="adminPassword"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      Admin Password
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      name="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      placeholder="Enter your Admin's password..."
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmAdminPassword"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      Confirm Admin Password
                    </label>
                    <input
                      type="password"
                      id="confirmAdminPassword"
                      name="confirmAdminPassword"
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      required
                      placeholder="Confirm your Admin's password..."
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-royal-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
                    >
                      {isLoading ? "Registering..." : "Get Started"}
                    </button>
                  </div>
                </div>
              </form>

              <p className="mt-6 text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-royal-blue-500 hover:text-royal-blue-600"
                >
                  Log in here
                </Link>
                .
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center min-h-56 text-gray-600 text-lg">
            <h1>Thank you for registering!</h1>
            <p>
              Please check your email to verify your registration before{" "}
              <Link
                to="/login"
                className="underline text-royal-blue-500 hover:text-royal-blue-600 "
              >
                logging in.
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
