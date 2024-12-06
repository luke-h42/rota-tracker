import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProtectedRoutes({ allowedRoles }) {
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/authentication", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        setUser(null); // User not authenticated
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col h-[calc(100vh-40px)] bg-white ">
        <h1 className="text-5xl text-gray-700 dark:text-gray-300">
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

  return <Outlet />;
}
