import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex items-center flex-col min-h-screen pt-[72px]  bg-white text-center text-black">
      <h1 className="text-5xl ">Dashboard</h1>
      {!!user && (
        <h2 className="text-3xl ">
          Hi {user.name}! You work for {user.companyName || "a company"} and
          your role is {user.role}
        </h2>
      )}
    </div>
  );
}

export default Dashboard;
