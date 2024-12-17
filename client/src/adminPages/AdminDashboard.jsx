import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import AdminReporting from "./AdminReporting";
import AdminManageUsers from "./AdminManageUsers";
import AdminManageShifts from "./AdminManageShifts";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = useState("manageShifts");
  const renderComponent = () => {
    switch (selectedComponent) {
      case "manageUsers":
        return <AdminManageUsers />;
      case "manageShifts":
        return <AdminManageShifts />;
      case "reporting":
        return <AdminReporting />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center flex-col md:pt-6 bg-white text-black text-center">
      <div className="mb-4">
        <h1 className="text-5xl ">Admin Dashboard</h1>
        {!!user && <h2 className="text-3xl ">Hi {user.name}!</h2>}
      </div>
      {/* Render the corresponding component based on the selected option */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 max-w-4xl">
          <button
            onClick={() => setSelectedComponent("manageUsers")}
            className={`p-2 rounded-md w-full transition duration-200 ease-in-out border border-royal-blue-500 
    ${
      selectedComponent === "manageUsers"
        ? "bg-royal-blue-500 text-white"
        : "bg-white text-black hover:bg-royal-blue-500 hover:text-white"
    }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setSelectedComponent("manageShifts")}
            className={`p-2 rounded-md w-full transition duration-200 ease-in-out border border-royal-blue-500 
    ${
      selectedComponent === "manageShifts"
        ? "bg-royal-blue-500 text-white"
        : "bg-white text-black hover:bg-royal-blue-500 hover:text-white"
    }`}
          >
            Manage Shifts
          </button>
          <button
            onClick={() => setSelectedComponent("reporting")}
            className={`p-2 rounded-md w-full transition duration-200 ease-in-out border border-royal-blue-500 
    ${
      selectedComponent === "reporting"
        ? "bg-royal-blue-500 text-white"
        : "bg-white text-black hover:bg-royal-blue-500 hover:text-white"
    }`}
          >
            Reporting
          </button>
        </div>
      </div>

      {/* Render the selected component */}
      <div className=" w-full">{renderComponent()}</div>
    </div>
  );
}

export default AdminDashboard;
