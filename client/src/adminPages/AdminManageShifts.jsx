import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import AdminAddShift from "./adminComponents/AdminAddShift";
import AdminEditShift from "./adminComponents/AdminEditShift";
import AdminDeleteShift from "./adminComponents/AdminDeleteShift";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminManageShifts() {
  const { user } = useContext(UserContext);
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [addNewShiftModal, setAddNewShiftModal] = useState(false);
  const [editShiftModal, setEditShiftModal] = useState(false);
  const [deleteShiftModal, setDeleteShiftModal] = useState(false);
  const [emailUsersModal, setEmailUsersModal] = useState(false);
  // Function to get the Monday of a given week
  const getMondayOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    return monday;
  };

  const findShiftsInRange = async () => {
    setIsLoading(true);
    const startDateSearch = new Date(currentMonday);
    const endDateSearch = new Date(currentMonday);
    endDateSearch.setDate(currentMonday.getDate() + 6);
    const formattedStartDate = startDateSearch.toISOString().split("T")[0];
    const formattedEndDate = endDateSearch.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `/api/shifts/shift-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      setShifts(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Error loading shifts, please try again."
      );
      setIsLoading(false);
    }
  };

  // Send email to those on page
  const sendShiftsEmail = async () => {
    const userIds = shifts.map((shift) => shift.user._id);
    const payload = { userIds };
    try {
      const response = await axios.post(
        "/api/shifts/send-shifts-email",
        payload,

        {
          withCredentials: true,
        }
      );
      toast.success("Email notification sent.");
      setEmailUsersModal(false);
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Error sending emails, please try again."
      );
      setIsLoading(false);
    }
  };

  const [currentMonday, setCurrentMonday] = useState(
    getMondayOfWeek(new Date())
  );
  useEffect(() => {
    findShiftsInRange();
  }, [currentMonday]);

  // Function to handle the "Next Week" button click
  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
  };

  // Function to handle the "Previous Week" button click
  const handlePrevWeek = () => {
    const prevMonday = new Date(currentMonday);
    prevMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(prevMonday);
  };
  // Function to handle the "Current Week" button click
  const handleCurrentWeek = () => {
    setCurrentMonday(getMondayOfWeek(new Date()));
  };

  // Function to handle the date change from date picker
  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const monday = getMondayOfWeek(selectedDate); // Ensure the selected date is a Monday
    setCurrentMonday(monday);
  };

  // Get the next and previous Monday based on currentMonday
  const nextMonday = new Date(currentMonday);
  nextMonday.setDate(currentMonday.getDate() + 7);

  const prevMonday = new Date(currentMonday);
  prevMonday.setDate(currentMonday.getDate() - 7);

  // Generate an array of the 7 days of the current week starting from Monday
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentMonday);
    day.setDate(currentMonday.getDate() + i); // Increment the date to get each day of the week
    daysOfWeek.push(day);
  }

  const handleDayClick = (day) => {
    const formattedDate = day.toISOString().split("T")[0];

    setSelectedDay(formattedDate);
  };

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="flex flex-col gap-2 px-4 py-6 max-w-full w-full ">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold text-center mb-2">Manage Shifts</h1>
          <p>
            Managing shifts for{" "}
            <span className="underline">
              {user?.companyName || "a company"}
            </span>
          </p>

          <div className="flex flex-col items-center">
            <label htmlFor="weekcommencing" className="mb-2">
              Week commencing:
            </label>
            <input
              type="date"
              id="weekcommencing"
              value={currentMonday.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="border p-2 rounded-md"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 sm:gap-8 px-1 py-2 w-auto">
            <button
              onClick={handlePrevWeek}
              className="border border-royal-blue-500 p-2 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out"
            >
              Previous Week
            </button>
            <button
              onClick={handleCurrentWeek}
              className="border border-royal-blue-500 p-2 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out"
            >
              Current Week
            </button>
            <button
              onClick={handleNextWeek}
              className="border border-royal-blue-500 p-2 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out"
            >
              Next Week
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading shift data...</p>
            </div>
          ) : (
            <>
              {/* <div>
                <h1 className="text-xl pl-4 underline">Current week shifts</h1>
              </div> */}
              <div className="w-full max-w-screen-sm">
                {daysOfWeek.map((day, index) => {
                  // Return shifts per day, sorted by start and end time
                  const dayShifts = shifts.filter((shift) => {
                    const shiftDate = new Date(shift.startDate);
                    return (
                      shiftDate.toLocaleDateString("en-GB") ===
                      day.toLocaleDateString("en-GB")
                    );
                  });
                  dayShifts.sort((a, b) => {
                    const endA = new Date(a.endTime);
                    const endB = new Date(b.endTime);
                    return endA - endB;
                  });
                  dayShifts.sort((a, b) => {
                    const startA = new Date(a.startTime);
                    const startB = new Date(b.startTime);
                    return startA - startB;
                  });

                  return (
                    <div className="border-b py-2 mb-2" key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-lg text-gray-700">
                          {day.toLocaleDateString("en-GB", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <button
                          onClick={() => {
                            handleDayClick(day);
                            setAddNewShiftModal(true);
                          }}
                          className=" px-1 py-1 rounded-md border border-royal-blue-500 text-gray-800 hover:bg-royal-blue-500  hover:text-white"
                        >
                          <svg
                            className="flex place-self-end w-6 h-6  "
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        {dayShifts.length > 0 ? (
                          dayShifts.map((shift) => (
                            <div
                              className="flex justify-between pt-1"
                              key={shift._id}
                            >
                              <div>
                                {shift.user.name} -{" "}
                                {new Date(shift.startTime).toLocaleTimeString(
                                  "en-GB",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}{" "}
                                to{" "}
                                {new Date(shift.endTime).toLocaleTimeString(
                                  "en-GB",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </div>
                              <div className="flex gap-2 ">
                                <svg
                                  className="w-6 h-6 text-gray-800 cursor-pointer hover:text-royal-blue-500"
                                  onClick={() => {
                                    setEditShiftModal(true);
                                    setSelectedShift(shift._id);
                                  }}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                                    clipRule="evenodd"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <svg
                                  className="w-6 h-6 text-gray-800 cursor-pointer hover:text-royal-blue-500"
                                  onClick={() => {
                                    setDeleteShiftModal(true);
                                    setSelectedShift(shift._id);
                                  }}
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-left">-</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col max-w-md gap-2">
                <p>
                  Shifts are automatically displayed when users log in. Use the
                  button below to send an email notification to users.
                </p>
                <button
                  className="border hover:border-royal-blue-500 hover:bg-white hover:text-black p-2 rounded-md bg-royal-blue-500 text-white transition duration-200 ease-in-out"
                  onClick={() => setEmailUsersModal(true)}
                >
                  Send Notification
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {addNewShiftModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setAddNewShiftModal(false), setSelectedDay("");
          }}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Shift</h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setAddNewShiftModal(false);
                  setSelectedDay("");
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

            <AdminAddShift
              onClose={() => {
                setSelectedDay("");
                setAddNewShiftModal(false);
              }}
              fetchShifts={findShiftsInRange}
              selectedDay={selectedDay}
            />
          </div>
        </div>
      )}
      {/* Edit Shift Modal */}
      {editShiftModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setEditShiftModal(false), setSelectedShift("");
          }}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editing Shift</h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setEditShiftModal(false);
                  setSelectedShift("");
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

            <AdminEditShift
              onClose={() => {
                setSelectedShift("");
                setEditShiftModal(false);
              }}
              fetchShifts={findShiftsInRange}
              selectedShift={selectedShift}
            />
          </div>
        </div>
      )}
      {/* Delete Shift Modal */}
      {deleteShiftModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setDeleteShiftModal(false), setSelectedShift("");
          }}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Deleting Shift</h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setDeleteShiftModal(false);
                  setSelectedShift("");
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

            <AdminDeleteShift
              onClose={() => {
                setSelectedShift("");
                setDeleteShiftModal(false);
              }}
              fetchShifts={findShiftsInRange}
              selectedShift={selectedShift}
            />
          </div>
        </div>
      )}
      {/* Send Email Modal */}
      {emailUsersModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setEmailUsersModal(false);
          }}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sending Emails</h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setEmailUsersModal(false);
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
              <div className="place-self-start text-left ">
                You are sending an email notification to the following users:
                {shifts.map((shift, index) => (
                  <p key={index} className="text-center">
                    {shift.user.name}
                  </p>
                ))}
              </div>
              <div className="w-full flex justify-between ">
                <button
                  className="bg-green-300 text-black px-4 py-2 rounded-md border hover:text-gray-900 hover:bg-green-500 w-1/4 md:w-auto disabled:bg-gray-500 "
                  onClick={sendShiftsEmail}
                  disabled={isLoading}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="bg-red-300 text-black px-4 py-2 rounded-md border hover:text-gray-900 hover:bg-red-500 w-1/4 md:w-auto disabled:bg-gray-500"
                  onClick={() => setEmailUsersModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
