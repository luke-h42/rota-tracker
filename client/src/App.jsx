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
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoutes allowedRoles={["user", "admin", "owner"]} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={["admin", "owner"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<AdminManageUsers />} />
          <Route path="/manage-shifts" element={<AdminManageShifts />} />
          <Route path="/reporting" element={<AdminReporting />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={["owner"]} />}>
          <Route path="/register-company" element={<RegisterNewCompany />} />
          <Route path="/register-new-admin" element={<RegisterNewAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
