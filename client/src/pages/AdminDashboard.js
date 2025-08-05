import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaUsers, FaGift, FaHandshake, FaChartLine, FaEye, FaBan, FaCheck, FaTimes, FaTrash, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalRequests: 0,
    totalDonations: 0,
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Simulate loading admin data
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalItems: 892,
        totalRequests: 1567,
        totalDonations: 743,
      });

      setUsers([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          role: 'donor',
          status: 'active',
          itemsDonated: 15,
          joinedDate: '2023-06-15',
          lastActive: '2024-01-15',
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          role: 'recipient',
          status: 'active',
          itemsReceived: 8,
          joinedDate: '2023-08-22',
          lastActive: '2024-01-14',
        },
        {
          id: 3,
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          role: 'ngo',
          status: 'pending',
          itemsDonated: 23,
          joinedDate: '2023-09-10',
          lastActive: '2024-01-13',
        },
        {
          id: 4,
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'donor',
          status: 'blocked',
          itemsDonated: 5,
          joinedDate: '2023-07-05',
          lastActive: '2024-01-10',
        },
      ]);

      setItems([
        {
          id: 1,
          title: 'Children\'s Books Collection',
          category: 'Books',
          donor: 'Sarah Johnson',
          status: 'active',
          createdAt: '2024-01-15',
          viewCount: 45,
          requestCount: 3,
        },
        {
          id: 2,
          title: 'Winter Jacket',
          category: 'Clothing',
          donor: 'Mike Chen',
          status: 'pending',
          createdAt: '2024-01-14',
          viewCount: 32,
          requestCount: 1,
        },
        {
          id: 3,
          title: 'Laptop Stand',
          category: 'Electronics',
          donor: 'Emily Davis',
          status: 'reported',
          createdAt: '2024-01-13',
          viewCount: 28,
          requestCount: 2,
        },
      ]);

      setRequests([
        {
          id: 1,
          item: 'Children\'s Books Collection',
          requester: 'John Smith',
          donor: 'Sarah Johnson',
          status: 'pending',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          item: 'Winter Jacket',
          requester: 'Maria Garcia',
          donor: 'Mike Chen',
          status: 'accepted',
          createdAt: '2024-01-14',
        },
        {
          id: 3,
          item: 'Laptop Stand',
          requester: 'David Wilson',
          donor: 'Emily Davis',
          status: 'completed',
          createdAt: '2024-01-13',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        if (action === 'block') {
          return { ...user, status: 'blocked' };
        } else if (action === 'unblock') {
          return { ...user, status: 'active' };
        } else if (action === 'verify') {
          return { ...user, status: 'active' };
        }
      }
      return user;
    }));
    toast.success(`User ${action}ed successfully`);
  };

  const handleItemAction = (itemId, action) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        if (action === 'approve') {
          return { ...item, status: 'active' };
        } else if (action === 'reject') {
          return { ...item, status: 'rejected' };
        } else if (action === 'delete') {
          return { ...item, status: 'deleted' };
        }
      }
      return item;
    }));
    toast.success(`Item ${action}d successfully`);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800',
      reported: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role) => {
    const colorMap = {
      donor: 'bg-green-100 text-green-800',
      recipient: 'bg-blue-100 text-blue-800',
      ngo: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the KindKart platform and community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaGift className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalItems.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaHandshake className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FaChartLine className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalDonations.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Items
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">New user registration</span>
                      <span className="text-sm text-gray-500">2 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Item reported for review</span>
                      <span className="text-sm text-gray-500">15 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Successful donation completed</span>
                      <span className="text-sm text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Review Pending Items
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Moderate Users
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <FaFilter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <FaUsers className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role === 'donor' ? `${user.itemsDonated} donated` : user.role === 'recipient' ? `${user.itemsReceived} received` : 'NGO'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'block')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaBan />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'unblock')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {user.status === 'pending' && (
                              <button
                                onClick={() => handleUserAction(user.id, 'verify')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Item Moderation</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <FaFilter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                          <span>Donor: {item.donor}</span>
                          <span>{item.viewCount} views</span>
                          <span>{item.requestCount} requests</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <div className="flex space-x-2">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleItemAction(item.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleItemAction(item.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          {item.status === 'reported' && (
                            <button
                              onClick={() => handleItemAction(item.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Request Management</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <FaFilter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.requester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.donor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 