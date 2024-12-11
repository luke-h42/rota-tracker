import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function ChangeEmail({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newEmail || !password) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    const lowerCaseEmail = newEmail.toLowerCase();
    try {
      const { data } = await axios.put(
        "/api/users/change-email",
        {
          newEmail: lowerCaseEmail,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setNewEmail("");
        setPassword("");
        setIsLoading(false);
        toast.success("Email updated.");
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Email update failed, please try again"
      );
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md  max-h-[80vh] overflow-auto">
        <form>
          <div className="mb-4">
            <label
              htmlFor="user-email"
              name="user-email"
              className="block text-sm font-medium mb-2"
            >
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              id="user-email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your new email"
              aria-label="New Email address"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="user-password"
              name="user-password"
              className="block text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="user-password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-label="Current Password"
              required
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              changeEmail(e);
            }}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Updating email..." : "Update email"}
          </button>
        </form>
      </div>
    </div>
  );
}
