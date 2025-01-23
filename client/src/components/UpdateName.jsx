import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
export default function UpdateName({ onClose }) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, refreshUserContext } = useContext(UserContext);
  const updateName = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newName || !password) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(
        "/api/users/change-name",
        {
          newName,
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
        setNewName("");
        setPassword("");
        setIsLoading(false);
        toast.success("Name updated.");
        await refreshUserContext();
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Name update failed, please try again"
      );
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md  max-h-[80vh] overflow-auto">
        <p className="mb-4">Current Name: {user.name}</p>
        <form>
          <div className="mb-4">
            <label
              htmlFor="user-name"
              name="user-name"
              className="block text-sm font-medium mb-2"
            >
              New Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              id="user-name"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Enter your new name"
              aria-label="New Name"
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
              updateName(e);
            }}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Updating name..." : "Update name"}
          </button>
        </form>
      </div>
    </div>
  );
}
