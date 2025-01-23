import { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const { user, setUser, refreshUserContext } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = data;
    if (!email || !password) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      if (response.data.error === "Please verify your email first") {
        setVerificationError(true);
        console.log(verificationError);
        toast.error("Please verify your email first.");
        setIsLoading(false);
        return;
      }
      // If the backend sends an error, show it via toast
      if (response.data.error) {
        toast.error(response.data.error); // Show the error message sent from the backend
        setIsLoading(false);
        return;
      } else {
        // Handle successful login and set the user context
        setUser(response.data); // Assuming the response contains the user's data
        setData({
          email: "",
          password: "",
        });
        setIsLoading(false);
        toast.success("Login Successful");

        // Refresh the user context and navigate
        await refreshUserContext();
        navigate("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);

      // Handle errors if the backend responds with something unexpected
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show backend error
      } else {
        toast.error("Login Failed");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoadingResetPassword(true);
    if (!forgotEmail) {
      toast.error("Please fill in your email");
      return;
    }

    try {
      const response = await axios.post("api/auth/reset-password-link", {
        email: forgotEmail,
      });
      if (response.data.error) {
        toast.error(response.data.error);
        setIsLoadingResetPassword(false);
      } else {
        setForgotEmail("");
        toast.success("Reset password link sent, please check your email");
        setIsLoadingResetPassword(false);
        setForgotPasswordModal(false);
      }
    } catch (error) {
      setIsLoadingResetPassword(false);
      toast.error("Password link failed to send, please try again.");
    }
  };

  const handleResendVerification = async () => {
    setVerificationError(false); // Reset error state
    const { email } = data;

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/resend-verification", {
        email,
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Verification email sent. Please check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to send verification email.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black mt-[15vh]">
      <div className="bg-white rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              name="email"
              className="block text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => {
                setVerificationError(false);
                setData({ ...data, email: e.target.value });
              }}
              id="email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              name="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              id="password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-label="Current Password"
              required
            />
          </div>

          <button
            type="button"
            name="login"
            onClick={loginUser}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="pt-2 flex justify-between text-royal-blue-500 ">
          <Link to="/get-started" className="hover:underline">
            <p>Sign up</p>
          </Link>
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setForgotPasswordModal(true)}
          >
            Forgot password?
          </p>
        </div>
        {/* Show Resend Verification Button if Email is Unverified */}
        {verificationError && (
          <div className="flex flex-col mt-4 text-center gap-2">
            <p className="text-sm text-gray-700">
              It looks like you haven't verified your email yet. Please check
              your inbox or click below to send a new verification email.
            </p>
            <button
              onClick={handleResendVerification}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend Verification Link
            </button>
          </div>
        )}
      </div>

      {forgotPasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setForgotPasswordModal(false);
          }}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reset Password</h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setForgotPasswordModal(false);
                }}
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center w-full text-black gap-4">
              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <form
                onSubmit={handleForgotPassword}
                className="flex flex-col gap-2 w-full "
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoadingResetPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoadingResetPassword
                    ? "Submitting..."
                    : "Get reset password link"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
