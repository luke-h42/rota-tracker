import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useTrialCheck from "../src/components/TrialStatus";

export default function ProtectedRoutes({ allowedRoles }) {
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  // Using the custom hook for trial check
  const { bannerMessage, accessBlocked } = useTrialCheck();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/authentication", {
          withCredentials: true,
        });
        setUser(response.data);
        setSessionExpired(false); // Reset session expired state when user is fetched
      } catch (error) {
        if (
          error.response &&
          error.response.status === 401 &&
          !sessionExpired
        ) {
          setSessionExpired(true); // Set sessionExpired to true to prevent repeated toasts
          toast.error("Session expired, please log in again.");
          navigate("/login");
        }
        setUser(null); // User not authenticated
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate, sessionExpired]); // Use sessionExpired to prevent redundant fetching

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col h-[calc(100vh-40px)] bg-white">
        <h1 className="text-5xl text-gray-700 dark:text-gray-300 ">
          Loading...
        </h1>
      </div>
    );
  }

  // Check authentication and role
  if (!user || user.role === null) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  // Render trial banner if trial expired
  return (
    <div>
      {bannerMessage && !accessBlocked && (
        <div className="flex justify-center items-center w-full bg-red-300 py-2 mb-4">
          {bannerMessage}
          <Link to="/subscribe" className="underline">
            Subscribe now.
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  );
}
