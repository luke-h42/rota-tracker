import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [resend, setResend] = useState(false); // Set initial state to `false`
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `/api/auth/verify-email?token=${token}`
        );
        toast.success("Email Verified successfully!");
        setMessage(response.data.message);
      } catch (error) {
        if (error.response && error.response.data) {
          if (
            error.response.data.error ===
            "Verification token has expired. Please request a new one."
          ) {
            setResend(true); // Set resend to true if the token expired
            setMessage(
              "Your verification token has expired. Please enter your email for a new verification link."
            );
          } else {
            setMessage(error.response.data.error);
          }
        } else {
          toast.error("An error occurred during email verification.");
        }
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Please fill in your email.");
      setIsLoading(false);
      return;
    }

    const emailLowercase = email.toLowerCase(); // Use email state directly

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailLowercase)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/resend-verification", {
        email: emailLowercase,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to resend verification email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-black mt-[25vh]">
      <div className="bg-white rounded-lg px-8 py-6 max-w-md w-full items-center justify-center">
        <p className="flex items-center justify-center">{message}</p>
        {resend && (
          <div className="w-full p-4 flex flex-col justify-center items-center">
            <form
              onSubmit={handleResendVerification}
              className="flex flex-col gap-2 w-full "
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "Resending..." : "Resend Verification Email"}
              </button>
            </form>
          </div>
        )}
        <Link
          to="/login"
          className="flex items-center justify-center underline hover:text-royal-blue-500"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
