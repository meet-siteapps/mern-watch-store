// src/pages/admin/Users.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function AdminUsers() {
  const { user, getToken, logout } = useUser();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching users with token:", token);
      
      const response = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Users response:", response.data);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        // Clear the current user and redirect to login
        logout();
        navigate('/admin/login');
        return;
      }
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("Network error: Unable to connect to the server. Please check your internet connection and ensure the server is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-900/30 text-red-400";
      case "user": return "bg-blue-900/30 text-blue-400";
      default: return "bg-gray-900/30 text-gray-400";
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      console.log(`Updating user ${userId} role to ${newRole}`);
      
      await api.put(`/users/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      
      // If the selected user is being updated, update that too
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/admin/login');
        return;
      }
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError("Network error: Unable to connect to the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      console.log(`Deleting user ${userId}`);
      
      await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setUsers(users.filter(u => u._id !== userId));
      
      // If the selected user is being deleted, close the modal
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/admin/login');
        return;
      }
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError("Network error: Unable to connect to the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access admin panel</h1>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:scale-105 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">User Management</h1>
          <p className="text-gray-400">View and manage all registered users</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-750">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4">
                      <SkeletonLoader type="table" />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                              <span className="text-blue-400 font-medium">
                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="user" className="bg-gray-800">User</option>
                          <option value="admin" className="bg-gray-800">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          {user._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      {users.length === 0 ? "No users found" : "No users match your filters"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-16 w-16">
                  <div className="h-16 w-16 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-400 text-xl font-medium">
                      {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-white">{selectedUser.username}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white">{selectedUser._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Role:</span>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleRoleChange(selectedUser._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(selectedUser.role)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="user" className="bg-gray-800">User</option>
                    <option value="admin" className="bg-gray-800">Admin</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined:</span>
                  <span className="text-white">{selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}</span>
                </div>
                {selectedUser.avatar && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avatar:</span>
                    <img 
                      src={selectedUser.avatar} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                {selectedUser._id !== user._id && (
                  <button
                    onClick={() => {
                      handleDeleteUser(selectedUser._id);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Delete User
                  </button>
                )}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}