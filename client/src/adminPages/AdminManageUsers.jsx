import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminCreateUsers from "./AdminCreateUsers";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [addNewUser, setAddNewUser] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/user-list");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const disableScrolling = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScrolling = () => {
      document.body.style.overflow = "unset";
    };

    if (addNewUser) {
      disableScrolling();
    } else {
      enableScrolling();
    }

    return () => {
      enableScrolling();
    };
  }, [addNewUser]);

  return (
    <div className="flex items-center justify-center w-full text-black pt-[72px]">
      <div className="flex flex-col gap-4 px-4 py-6 max-w-full w-full sm:max-w-lg">
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-4">Manage Users</h1>

          <button
            className="bg-royal-blue-300 p-2 rounded-md"
            onClick={() => setAddNewUser(true)}
          >
            Add new user
          </button>
        </div>

        {/* Scrollable table on small screens */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-left border-b font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 text-left border-b font-semibold">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {addNewUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setAddNewUser(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New User</h2>
              <button
                onClick={() => setAddNewUser(false)}
                className="text-gray-500"
              >
                X
              </button>
            </div>
            {/* Pass the fetchUsers prop to AdminCreateUsers */}
            <AdminCreateUsers
              onClose={() => setAddNewUser(false)}
              fetchUsers={fetchUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
