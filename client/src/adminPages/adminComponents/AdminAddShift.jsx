import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminAddShift({ onClose, fetchShifts, selectedDay }) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);

  const [data, setData] = useState({
    userName: "",
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
    breakTime: "0",
  });

  const createShift = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      userId: selectedUserId,
      shiftDate: data.shiftDate,
      shiftStartTime: data.shiftStartTime,
      shiftEndTime: data.shiftEndTime,
      breakTime: data.breakTime,
    };
    if (
      !selectedUserId ||
      !data.shiftDate ||
      !data.shiftStartTime ||
      !data.shiftEndTime ||
      !data.breakTime
    ) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }
    if (data.shiftEndTime <= data.shiftStartTime) {
      toast.error("Endtime cannot be before start time");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/shifts/add-shift",
        payload,

        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setSelectedUserId("");
        setData({
          userName: "",
          shiftDate: "",
          shiftStartTime: "",
          shiftEndTime: "",
          breakTime: "",
        });
        setIsLoading(false);
        toast.success("Shift created successfully");
        fetchShifts();
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Shift creation failed, please try again"
      );
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/user-list");
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDay) {
      setData((prevData) => ({
        ...prevData,
        shiftDate: selectedDay,
      }));
    }

    fetchUsers();
  }, []);

  const activeUsers = users.filter((user) => user.status === "Active");

  const sortedActiveUsers = [...activeUsers].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const timeSuggestions = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md  max-h-[80vh] overflow-auto">
        <form>
          <div className="flex gap-2 items-center mb-4 justify-center text-center">
            <h1 className="text-sm sm:text-base">
              You are adding a shift to the company: <br />
              <span className="underline">
                {user?.companyName || "No company"}
              </span>
            </h1>
          </div>

          {/* Choose a user */}
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Choose a user:
            </label>
            <select
              id="userName"
              name="userName"
              value={data.userName}
              onChange={(e) => {
                handleChange(e);
                const selectedUser = users.find(
                  (u) => u.name === e.target.value
                );
                setSelectedUserId(selectedUser?._id || "");
              }}
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5 w-full"
            >
              <option value="">-- Select --</option>
              {sortedActiveUsers.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Date */}
          <div className="mb-4">
            <label
              htmlFor="shiftDate"
              className="block text-sm font-medium text-gray-700"
            >
              Shift date:
            </label>
            <input
              type="date"
              id="shiftDate"
              name="shiftDate"
              value={data.shiftDate}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Shift Start Time with Quick Suggestions */}
          <div className="mb-4">
            <label
              htmlFor="shiftStartTime"
              className="block text-sm font-medium text-gray-700"
            >
              Shift start time:
            </label>
            <input
              type="time"
              id="shiftStartTime"
              name="shiftStartTime"
              value={data.shiftStartTime}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <div className="mt-2">
              <span className="text-sm text-gray-500 ">Quick suggestions:</span>
              <div className="grid grid-cols-5 gap-2 mt-1 ">
                {timeSuggestions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setData((prevData) => ({
                        ...prevData,
                        shiftStartTime: time,
                      }))
                    }
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shift End Time */}
          <div className="mb-4">
            <label
              htmlFor="shiftEndTime"
              className="block text-sm font-medium text-gray-700"
            >
              Shift end time:
            </label>
            <input
              type="time"
              id="shiftEndTime"
              name="shiftEndTime"
              value={data.shiftEndTime}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <div className="mt-2">
              <span className="text-sm text-gray-500">Quick suggestions:</span>
              <div className="grid grid-cols-5 gap-2 mt-1 ">
                {timeSuggestions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setData((prevData) => ({
                        ...prevData,
                        shiftEndTime: time,
                      }))
                    }
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Break Time */}
          <div className="mb-4">
            <label
              htmlFor="breakTime"
              className="block text-sm font-medium text-gray-700"
            >
              Break minutes:
            </label>
            <input
              type="number"
              id="breakTime"
              name="breakTime"
              value={data.breakTime}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={createShift}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Adding shift..." : "Add shift"}
          </button>
        </form>
      </div>
    </div>
  );
}
