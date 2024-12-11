import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ChangePassword({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Passwords must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.put(
        "/api/users/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setIsLoading(false);
        toast.success("Password changed.");
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Password change failed, please try again"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md max-h-[80vh] overflow-auto">
        <form>
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="new-password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your new password"
              required
              aria-label="New password"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium mb-2"
            >
              Confirm Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="current-password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
              aria-label="Current password"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              changePassword(e);
            }}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={isLoading ? "Changing password" : "Change password"}
          >
            {isLoading ? "Changing password..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
