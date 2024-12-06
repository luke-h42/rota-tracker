import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, email, password } = data;
    const lowerCaseEmail = email.toLowerCase();
    const camelName = capitalizeFirstLetter(name);

    try {
      const { data } = await axios.post("/api/auth/register", {
        name: camelName,
        email: lowerCaseEmail,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setData({});
        setIsLoading(false);
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Sign up failed, please try again");
      setIsLoading(false);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="flex items-center justify-center w-full text-black pt-[72px] ">
      <div className=" px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4 ">Welcome!</h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              name="name"
              className="block text-sm font-medium  mb-2"
            >
              Name
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              id="name"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium  mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
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
              className="block text-sm font-medium  mb-2"
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
            type="submit"
            onClick={registerUser}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
