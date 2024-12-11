import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminReporting() {
  const { user } = useContext(UserContext);
  const [startDateSearch, setStartDateSearch] = useState("");
  const [endDateSearch, setEndDateSearch] = useState("");
  const [monthSearch, setMonthSearch] = useState("");
  const [yearSearch, setYearSearch] = useState("2024");
  const [isLoading, setIsLoading] = useState(false);
  const [shifts, setShifts] = useState([]);

  const findShiftsInRange = async () => {
    setIsLoading(true);
    if (!startDateSearch || !endDateSearch) {
      toast.error("No Start or End date given");
      setIsLoading(false);
      return;
    }
    if (new Date(endDateSearch) < new Date(startDateSearch)) {
      toast.error("End date must be after start date");
      setShifts([]);
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `/api/shifts/shift-date-range?startDate=${startDateSearch}&endDate=${endDateSearch}`
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

  const findShiftsForMonth = async (month, year) => {
    const monthIndex = months.indexOf(month) + 1;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/shifts/shift-month-range?month=${monthIndex}&year=${year}`
      );

      setShifts(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error loading shifts, please try again.");
      setIsLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonthSearch(newMonth);
    setStartDateSearch("");
    setEndDateSearch("");
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYearSearch(newYear);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2024 + 2 },
    (_, i) => 2024 + i
  );

  const sortedShifts = shifts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    if (startDateSearch && endDateSearch) {
      findShiftsInRange();
    }
  }, [startDateSearch, endDateSearch]);

  useEffect(() => {
    if (yearSearch && monthSearch) {
      findShiftsForMonth(monthSearch, yearSearch);
    }
  }, [yearSearch, monthSearch]);

  const copyToClipboard = () => {
    let dateRange = "";
    if (startDateSearch && endDateSearch) {
      dateRange = `Date Range: ${new Date(startDateSearch).toLocaleDateString(
        "en-GB"
      )} - ${new Date(endDateSearch).toLocaleDateString("en-GB")}`;
    } else if (monthSearch && yearSearch) {
      dateRange = `Month: ${monthSearch} ${yearSearch}`;
    }

    const shiftData = shifts
      .map((shift) => {
        return `Name: ${shift.name}, Total Shifts: ${shift.shiftCount}, Hours Worked: ${shift.totalShiftDuration} hours`;
      })
      .join("\n");

    const textToCopy = `${dateRange}\n\n${shiftData}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Report copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the report.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-black pt-[72px]">
      <div className="flex flex-col gap-2 px-4 py-6 max-w-full w-full ">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold text-center mb-2">Reporting</h1>
          <p>
            Reports generated for{" "}
            <span className="underline">
              {user?.companyName || "a company"}
            </span>
          </p>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 max-w-md ">
            <div className="flex flex-col gap-2">
              <div className="flex md:flex-col justify-center items-center md:items-start gap-2 self-start">
                <label htmlFor="userName" className="flex">
                  Select a Month:
                </label>
                <select
                  id="userName"
                  name="userName"
                  value={monthSearch}
                  onChange={handleMonthChange}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">-- Select --</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex md:flex-col justify-center items-center md:items-start gap-2 self-start">
                <label htmlFor="year" className="">
                  Select a Year:
                </label>
                <select
                  id="year"
                  name="year"
                  value={yearSearch}
                  onChange={handleYearChange}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">-- Select --</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <h2>Or select a date range: </h2>
              <div className="flex flex-col justify-center gap-2">
                <div className="flex justify-center items-center gap-2">
                  <label htmlFor="start-of-search" className=" text-left">
                    Start:
                  </label>
                  <input
                    type="date"
                    id="start-of-search"
                    value={startDateSearch}
                    onChange={(e) => {
                      setStartDateSearch(e.target.value);
                      setMonthSearch("");
                    }}
                    className="border p-2 rounded-md"
                  />
                </div>
                <div className="flex justify-center items-center gap-3">
                  <label htmlFor="end-of-search" className=" text-left">
                    End:
                  </label>
                  <input
                    type="date"
                    id="end-of-search"
                    value={endDateSearch}
                    onChange={(e) => {
                      setEndDateSearch(e.target.value);
                      setMonthSearch("");
                    }}
                    className="border p-2 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(startDateSearch && endDateSearch) || (monthSearch && yearSearch) ? (
        isLoading ? (
          <div className="flex justify-center items-center">
            <p>Loading report, please wait...</p>
            {/* You can also add a spinner here */}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl pl-4 text-center ">
                {startDateSearch && endDateSearch ? (
                  <>
                    Shifts in the range <br />
                    {new Date(startDateSearch).toLocaleDateString(
                      "en-UK"
                    )} - {new Date(endDateSearch).toLocaleDateString("en-UK")}
                  </>
                ) : monthSearch && yearSearch ? (
                  `Shifts for ${monthSearch} ${yearSearch}`
                ) : (
                  "Shifts"
                )}
              </h1>
              <button
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-royal-blue-500 w-1/4 hover:text-white transition duration-200 ease-in-out border border-royal-blue-500 place-self-center"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border-b font-semibold ">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold ">
                      Shifts worked
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold ">
                      Hours worked
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedShifts.map((shift) => (
                    <tr key={shift.userId}>
                      <td className="px-4 py-2 border-b whitespace-nowrap">
                        {shift.name}
                      </td>
                      <td className="px-4 py-2 border-b whitespace-nowrap ">
                        {shift.shiftCount}
                      </td>
                      <td className="px-4 py-2 border-b whitespace-nowrap ">
                        {shift.totalShiftDuration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <p>Please select a month or date range above</p>
      )}
    </div>
  );
}
