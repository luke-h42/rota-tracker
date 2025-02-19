import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { UserContextProvider } from "../context/userContext";
import axios from "axios";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";

// Pages and Admin Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./adminPages/AdminDashboard";
import AdminManageUsers from "./adminPages/AdminManageUsers";
import AdminManageShifts from "./adminPages/AdminManageShifts";
import AdminReporting from "./adminPages/AdminReporting";
import Settings from "./pages/Settings";
import GetStarted from "./pages/GetStarted";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";

// Owner Pages
import RegisterNewCompany from "./ownerPages/RegisterNewCompany";
import RegisterNewAdmin from "./ownerPages/RegisterNewAdmin";

// Layout Component
import Layout from "./components/Layout";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";

// Axios Configuration
// axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.baseURL = "https://rota-tracker.vercel.app/";
axios.defaults.withCredentials = true;

// Importing the PageTransitionWrapper component
import PageTransitionWrapper from "./components/PageTransitionWrapper";

function App() {
  const location = useLocation(); // Get the current location for route-based transitions

  return (
    <UserContextProvider>
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PageTransitionWrapper>
                <Home />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransitionWrapper>
                <Register />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PageTransitionWrapper>
                <VerifyEmail />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageTransitionWrapper>
                <ResetPassword />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransitionWrapper>
                <Login />
              </PageTransitionWrapper>
            }
          />
          <Route
            path="/get-started"
            element={
              <PageTransitionWrapper>
                <GetStarted />
              </PageTransitionWrapper>
            }
          />
          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoutes allowedRoles={["user", "admin", "owner"]} />
            }
          >
            <Route
              path="/dashboard"
              element={
                <PageTransitionWrapper>
                  <Dashboard />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransitionWrapper>
                  <Settings />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/subscribe"
              element={
                <PageTransitionWrapper>
                  <Subscribe />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/subscription-success"
              element={
                <PageTransitionWrapper>
                  <SubscriptionSuccess />
                </PageTransitionWrapper>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "owner"]} />}
          >
            <Route
              path="/admin"
              element={
                <PageTransitionWrapper>
                  <AdminDashboard />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/manage-users"
              element={
                <PageTransitionWrapper>
                  <AdminManageUsers />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/manage-shifts"
              element={
                <PageTransitionWrapper>
                  <AdminManageShifts />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/reporting"
              element={
                <PageTransitionWrapper>
                  <AdminReporting />
                </PageTransitionWrapper>
              }
            />
          </Route>

          {/* Owner Routes */}
          <Route element={<ProtectedRoutes allowedRoles={["owner"]} />}>
            <Route
              path="/register-company"
              element={
                <PageTransitionWrapper>
                  <RegisterNewCompany />
                </PageTransitionWrapper>
              }
            />
            <Route
              path="/register-new-admin"
              element={
                <PageTransitionWrapper>
                  <RegisterNewAdmin />
                </PageTransitionWrapper>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
