import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./adminPages/AdminDashboard";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import RegisterNewCompany from "./ownerPages/RegisterNewCompany";
import RegisterNewAdmin from "./ownerPages/RegisterNewAdmin";
import AdminManageUsers from "./adminPages/AdminManageUsers";
import AdminManageShifts from "./adminPages/AdminManageShifts";
import AdminReporting from "./adminPages/AdminReporting";
import Settings from "./pages/Settings";
import GetStarted from "./pages/GetStarted";
import Footer from "./components/Footer";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
axios.defaults.baseURL = "http://localhost:5000";
// axios.defaults.baseURL = "https://rota-tracker.vercel.app/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <div className="flex flex-col min-h-screen ">
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        <div className="flex-grow ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/get-started" element={<GetStarted />} />

            <Route
              element={
                <ProtectedRoutes allowedRoles={["user", "admin", "owner"]} />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscribe" element={<Subscribe />} />
            </Route>
            <Route
              element={<ProtectedRoutes allowedRoles={["admin", "owner"]} />}
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manage-users" element={<AdminManageUsers />} />
              <Route path="/manage-shifts" element={<AdminManageShifts />} />
              <Route path="/reporting" element={<AdminReporting />} />
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={["owner"]} />}>
              <Route
                path="/register-company"
                element={<RegisterNewCompany />}
              />
              <Route
                path="/register-new-admin"
                element={<RegisterNewAdmin />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </UserContextProvider>
  );
}

export default App;
