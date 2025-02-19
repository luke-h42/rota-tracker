import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useTrialCheck from "../src/components/TrialStatus";

export default function ProtectedRoutes({ allowedRoles }) {
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [redirecting, setRedirecting] = useState(false); // Prevent infinite redirection
  const navigate = useNavigate();
  const { bannerMessage, accessBlocked } = useTrialCheck();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/authentication", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired, please log in again.");
          setRedirecting(true); // Flag that we're redirecting
          navigate("/login", { replace: true }); // Prevent looping by using replace
        } else {
          setUser(null); // User is not authenticated
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!redirecting) {
      fetchUser();
    }
  }, [navigate, redirecting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col h-[calc(100vh-40px)] bg-white">
        <h1 className="text-5xl text-gray-700 dark:text-gray-300 ">
          Loading...
        </h1>
      </div>
    );
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      {bannerMessage && !accessBlocked && (
        <div className="flex justify-center items-center w-full bg-red-300 py-2 mb-4">
          {bannerMessage}
        </div>
      )}
      <Outlet />
    </div>
  );
}
