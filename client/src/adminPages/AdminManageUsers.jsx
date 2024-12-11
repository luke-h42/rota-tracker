import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import AdminCreateUsers from "./adminComponents/AdminCreateUsers";
import AdminEditUsers from "./adminComponents/AdminEditUsers";

export default function AdminManageUsers() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [addNewUserModal, setAddNewUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/user-list");
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      setIsLoading(false);
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

    if (addNewUserModal) {
      disableScrolling();
    } else {
      enableScrolling();
    }

    return () => {
      enableScrolling();
    };
  }, [addNewUserModal]);

  const activeUsers = users.filter((user) => user.status === "Active");
  const inactiveUsers = users.filter((user) => user.status === "Inactive");

  // Sort active users
  const sortedActiveUsers = [...activeUsers].sort((a, b) => {
    // If statuses are the same, sort by role: "admin" first, then others
    if (a.role === "admin" && b.role !== "admin") {
      return -1;
    }
    if (a.role !== "admin" && b.role === "admin") {
      return 1;
    }
    // If roles are the same, sort by name alphabetically
    return a.name.localeCompare(b.name);
  });

  // Sort users based on the given criteria
  const sortedInactiveUsers = [...inactiveUsers].sort((a, b) => {
    // If statuses are the same, sort by role: "admin" first, then others
    if (a.role === "admin" && b.role !== "admin") {
      return -1;
    }
    if (a.role !== "admin" && b.role === "admin") {
      return 1;
    }
    // If roles are the same, sort by name alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex items-center justify-center w-full text-black ">
      <div className="flex flex-col gap-2 px-4 py-6 max-w-full w-auto ">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold text-center mb-2">Manage Users</h1>
          <p>
            Managing users for{" "}
            <span className="underline">
              {user?.companyName || "a company"}
            </span>
          </p>
          <button
            className="border border-royal-blue-500 p-2 rounded-md hover:bg-royal-blue-500 hover:text-white transition duration-200 ease-in-out"
            onClick={() => setAddNewUserModal(true)}
          >
            Add new user
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading user data...</p>
          </div>
        ) : (
          <>
            {/* Active Users table */}
            <div>
              <h1 className="text-xl pl-4 underline">Active Users</h1>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/3 min-w-48">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/3">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/6">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/6">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedActiveUsers.map((user) => (
                    <tr key={user._id} className="text-left">
                      <td className="px-4 py-2 border-b whitespace-nowrap w-1/3 min-w-48">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border-b w-1/3 ">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 border-b w-1/6 ">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </td>
                      <td className="px-4 py-2 border-b w-1/6">
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </td>
                      <td
                        className="flex justify-center px-4 py-2 border-b cursor-pointer hover:underline "
                        onClick={() => {
                          setSelectedUser(user._id);
                          setEditUserModal(true);
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 hover:text-royal-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Inactive users table*/}

            <div className="pl-4">
              <h1 className="text-xl underline">Inactive Users</h1>
              <p>
                These users are retained in the system, but they will not appear
                when managing shifts.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/3 min-w-48">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/3">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/6">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold w-1/6">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left border-b font-semibold">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInactiveUsers.map((user) => (
                    <tr key={user._id} className="text-left">
                      <td className="px-4 py-2 border-b whitespace-nowrap w-1/3 min-w-48">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border-b w-1/3">{user.email}</td>
                      <td className="px-4 py-2 border-b w-1/6">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </td>
                      <td className="px-4 py-2 border-b w-1/6">
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </td>
                      <td
                        className="flex justify-center px-4 py-2 border-b cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectedUser(user._id);
                          setEditUserModal(true);
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add New User Modal */}
      {addNewUserModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setAddNewUserModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New User</h2>
              <button
                onClick={() => setAddNewUserModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <AdminCreateUsers
              onClose={() => setAddNewUserModal(false)}
              fetchUsers={fetchUsers}
            />
          </div>
        </div>
      )}
      {/* Edit a User Modal */}
      {editUserModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditUserModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Updating existing user</h2>
              <button
                onClick={() => setEditUserModal(false)}
                className="text-gray-500"
              >
                <svg
                  className="w-8 h-8 text-black hover:text-gray-900"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>

            <AdminEditUsers
              onClose={() => {
                setEditUserModal(false);
                setSelectedUser(null);
              }}
              userId={selectedUser}
              fetchUsers={fetchUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
