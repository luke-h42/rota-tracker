import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, refreshUserContext } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = data;

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        // Set user context after successful login
        setUser(data.user);
        setData({
          email: "",
          password: "",
        });
        setIsLoading(false);
        toast.success("Login Successful");

        // Refresh the user context to ensure data is up-to-date
        await refreshUserContext();

        // Navigate to the dashboard after context update
        navigate("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black pt-[72px]">
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
              onChange={(e) => setData({ ...data, email: e.target.value })}
              id="email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your email"
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
      </div>
    </div>
  );
}
