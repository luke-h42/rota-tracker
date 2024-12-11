import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [userShifts, setUserShifts] = useState([]);
  const [teamShifts, setTeamShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aggregatedHours, setAggregatedHours] = useState(0);
  const [selectedTab, setSelectedTab] = useState("userShifts");
  // Fetch user shifts
  const fetchUserShifts = async () => {
    try {
      const response = await axios.get("/api/shifts/user-shifts");
      setUserShifts(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error fetching user shifts");
      setIsLoading(false);
    }
  };

  const fetchTeamShifts = async () => {
    try {
      const response = await axios.get("/api/shifts/shift-list");
      setTeamShifts(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error fetching team shifts");
      setIsLoading(false);
    }
  };

  // Get Monday of the week for a given date
  const getMondayOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0); // Start of the day
    return monday;
  };

  const [currentMonday, setCurrentMonday] = useState(
    getMondayOfWeek(new Date())
  );
  // Get Sunday of the week from a Monday
  const getSundayOfWeek = (monday) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // Sunday is 6 days after Monday
    sunday.setHours(23, 59, 59, 999); // End of the day
    return sunday;
  };

  // Calculate aggregated hours for the selected week
  const calculateAggregatedHours = (userShifts, monday) => {
    const sunday = getSundayOfWeek(monday);
    let totalHours = 0;

    userShifts.forEach((shift) => {
      const shiftStartDate = new Date(shift.startDate);

      // If the shift's start date is within the selected week (Monday to Sunday)
      if (shiftStartDate >= monday && shiftStartDate <= sunday) {
        totalHours += parseFloat(shift.shiftDuration); // Add shift duration to total
      }
    });

    setAggregatedHours(totalHours);
  };

  // Handle Next Week Button Click
  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
  };

  // Handle Previous Week Button Click
  const handlePrevWeek = () => {
    const prevMonday = new Date(currentMonday);
    prevMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(prevMonday);
  };

  // Handle Current Week Button Click
  const handleCurrentWeek = () => {
    setCurrentMonday(getMondayOfWeek(new Date()));
  };

  // Handle Date Picker Change
  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const monday = getMondayOfWeek(selectedDate); // Ensure the selected date is a Monday
    setCurrentMonday(monday);
  };

  // Fetch shifts on component mount and when currentMonday changes
  useEffect(() => {
    if (selectedTab === "userShifts") {
      fetchUserShifts();
    } else if (selectedTab === "teamShifts") {
      fetchTeamShifts();
    }
  }, [selectedTab]);

  // Recalculate aggregated hours when shifts or currentMonday changes
  useEffect(() => {
    if (userShifts.length > 0) {
      calculateAggregatedHours(userShifts, currentMonday);
    }
  }, [userShifts, currentMonday]);

  // Generate an array of the 7 days of the current week starting from Monday
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentMonday);
    day.setDate(currentMonday.getDate() + i); // Increment the date to get each day of the week
    daysOfWeek.push(day);
  }

  return (
    <div className="flex items-center flex-col min-h-screen pt-[72px]  bg-white text-center text-black">
      {user && <h2 className="text-3xl">Hi {user.name}!</h2>}

      <div className="flex flex-col items-center">
        <label htmlFor="weekcommencing" className="mb-2"></label>
        <input
          type="date"
          id="weekcommencing"
          value={currentMonday.toISOString().split("T")[0]} // Format date to YYYY-MM-DD
          onChange={handleDateChange}
          className="border p-2 rounded-md"
        />
      </div>
      <div>
        <div className="flex gap-1 sm:gap-8 px-1 py-2 ">
          <button
            onClick={handlePrevWeek}
            className="border border-royal-blue-500 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out inline-flex items-center justify-center p-2"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleCurrentWeek}
            className="border border-royal-blue-500 p-2 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out text-lg"
          >
            Current Week
          </button>
          <button
            onClick={handleNextWeek}
            className="border border-royal-blue-500 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out inline-flex items-center justify-center p-2"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9 5 7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Personal/Team buttons */}
        <div className="flex justify-between sm:gap-8 px-1 py-2 w-full">
          <button
            onClick={() => setSelectedTab("userShifts")}
            className={`border border-royal-blue-500 p-2 md:w-full rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out ${
              selectedTab === "userShifts"
                ? "bg-royal-blue-500 text-white"
                : "bg-white text-black hover:bg-royal-blue-500 hover:text-white"
            }`}
          >
            Personal View
          </button>
          <button
            onClick={() => setSelectedTab("teamShifts")}
            className={`border border-royal-blue-500 p-2 md:w-full rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out ${
              selectedTab === "teamShifts"
                ? "bg-royal-blue-500 text-white"
                : "bg-white text-black hover:bg-royal-blue-500 hover:text-white"
            }`}
          >
            Team View
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading shift data...</p>
        </div>
      ) : selectedTab === "userShifts" ? (
        <>
          <p>Total hours this week: {aggregatedHours} hours</p>
          <div className="w-full max-w-screen-sm grid-cols-1 p-4 ">
            {daysOfWeek.map((day, index) => {
              // Return shifts per day, sorted by start time
              const dayShifts = userShifts.filter((shift) => {
                const shiftDate = new Date(shift.startDate);
                return (
                  shiftDate.toLocaleDateString("en-GB") ===
                  day.toLocaleDateString("en-GB")
                );
              });

              dayShifts.sort(
                (a, b) => new Date(a.startTime) - new Date(b.startTime)
              );

              return (
                <div className="border mb-2 rounded-lg p-2" key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-lg text-gray-700">
                      {day.toLocaleDateString("en-GB", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {dayShifts.length > 0 ? (
                      dayShifts.map((shift) => (
                        <div
                          className="flex flex-col items-start pt-1"
                          key={shift._id}
                        >
                          <div>
                            Time:{" "}
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
                          <div>Break: {shift.breakTime} minutes.</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-left ">-</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        selectedTab === "teamShifts" && (
          <>
            <p>Viewing the team rota</p>
            <div className="w-full max-w-screen-sm grid-cols-1 p-4 ">
              {daysOfWeek.map((day, index) => {
                const dayShifts = teamShifts.filter((shift) => {
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
                  <div className="border mb-2 rounded-lg p-2" key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-lg text-gray-700">
                        {day.toLocaleDateString("en-GB", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {dayShifts.length > 0 ? (
                        dayShifts.map((shift) => (
                          <div
                            className="flex flex-col items-start pt-1"
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
          </>
        )
      )}
    </div>
  );
}

export default Dashboard;
