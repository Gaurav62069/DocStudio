import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Auth token frontend se get karna padega API hit karne ke liye
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Approve hone ke baad list ko refresh kar do
      fetchUsers();
    } catch (error) {
      console.error("Approval failed", error);
      alert("Approval failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-soft-bg)] font-sans text-gray-700 p-6">
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/generator")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition"
          >
            Go to Generator
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-[var(--shadow-neu)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b border-gray-200">
                <th className="p-4 font-semibold">Profile</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      {u.profilePic ? (
                        <img
                          src={u.profilePic}
                          alt="profile"
                          className="w-10 h-10 rounded-full shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-sm text-gray-500">{u.email}</td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-md ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isApproved ? (
                        <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-bold text-sm bg-yellow-100 px-3 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {!u.isApproved && (
                        <button
                          onClick={() => handleApprove(u._id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow transition text-sm"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
