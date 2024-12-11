import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminEditShift({
  onClose,
  fetchShifts,
  selectedShift,
}) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);

  const [data, setData] = useState({
    shiftId: "",
    userName: "",
    userId: "",
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
    breakTime: "0",
  });

  useEffect(() => {
    const fetchSingleShift = async () => {
      try {
        const response = await axios.get(`/api/shifts/shift/${selectedShift}`);
        setData({
          shiftId: selectedShift,
          userName: response.data.user.name,
          userId: response.data.user._id,
          shiftDate: new Date(response.data.startDate)
            .toISOString()
            .split("T")[0], // Convert to YYYY-MM-DD
          shiftStartTime: new Date(response.data.startTime).toLocaleTimeString(
            "en-GB",
            { hour: "2-digit", minute: "2-digit", hour12: false }
          ),
          shiftEndTime: new Date(response.data.endTime).toLocaleTimeString(
            "en-GB",
            { hour: "2-digit", minute: "2-digit", hour12: false }
          ),
          breakTime: response.data.breakTime,
        });
      } catch (error) {
        console.error("Error fetching shift data:", error);
        toast.error("Failed to fetch shift data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleShift();
  }, [selectedShift]);

  const editShift = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      shiftId: data.shiftId,
      userId: data.userId,
      shiftDate: data.shiftDate,
      shiftStartTime: data.shiftStartTime,
      shiftEndTime: data.shiftEndTime,
      breakTime: data.breakTime,
    };
    if (
      !data.shiftId ||
      !data.userId ||
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
      const { data } = await axios.put(
        `/api/shifts/shift/${selectedShift}`,
        payload,

        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setData({
          shiftId: "",
          userName: "",
          userId: "",
          shiftDate: "",
          shiftStartTime: "",
          shiftEndTime: "",
          breakTime: "0",
        });
        setIsLoading(false);
        toast.success("Shift updated successfully");
        fetchShifts();
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Shift update failed, please try again"
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
              You are editing a shift for the company: <br />
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
            onClick={editShift}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? "Updating shift..." : "Update shift"}
          </button>
        </form>
      </div>
    </div>
  );
}
