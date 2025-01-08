import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  // Fetch user data on initial mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });

        if (data) {
          setUser({
            name: data.name,
            companyName: data.companyName,
            role: data.role,
            subscriptionStatus: data.subscriptionStatus,
            trialEndDate: data.trialEndDate,
            subscriptionPlan: data.subscriptionPlan,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to manually refresh user context (e.g., after login)
  const refreshUserContext = async () => {
    try {
      const { data } = await axios.get("/api/auth/profile", {
        withCredentials: true,
      });
      if (data) {
        setUser({
          name: data.name,
          companyName: data.companyName,
          role: data.role,
          subscriptionStatus: data.subscriptionStatus,
          trialEndDate: data.trialEndDate,
          subscriptionPlan: data.subscriptionPlan,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUserContext }}>
      {children}
    </UserContext.Provider>
  );
}
