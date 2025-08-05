import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGift, FaHandshake, FaChartLine, FaPlus, FaSearch, FaHistory, FaUser, FaBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    itemsDonated: 0,
    itemsReceived: 0,
    totalImpact: 0,
    activeRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        itemsDonated: user?.role === 'donor' ? 12 : 0,
        itemsReceived: user?.role === 'recipient' ? 8 : 0,
        totalImpact: user?.role === 'donor' ? 24 : user?.role === 'recipient' ? 16 : 0,
        activeRequests: 3,
      });
      setRecentActivity([
        {
          id: 1,
          type: 'donation',
          title: 'Books donated to local library',
          date: '2024-01-15',
          status: 'completed',
        },
        {
          id: 2,
          type: 'request',
          title: 'Request for winter clothes',
          date: '2024-01-14',
          status: 'pending',
        },
        {
          id: 3,
          type: 'donation',
          title: 'Furniture picked up by recipient',
          date: '2024-01-13',
          status: 'completed',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedActions = () => {
    if (user?.role === 'donor') {
      return [
        { icon: FaPlus, title: 'Donate Item', link: '/create-item', color: 'bg-green-500' },
        { icon: FaHistory, title: 'My Donations', link: '/my-donations', color: 'bg-blue-500' },
        { icon: FaHandshake, title: 'Requests', link: '/requests', color: 'bg-purple-500' },
      ];
    } else if (user?.role === 'recipient') {
      return [
        { icon: FaSearch, title: 'Browse Items', link: '/items', color: 'bg-blue-500' },
        { icon: FaHistory, title: 'My Requests', link: '/requests', color: 'bg-purple-500' },
        { icon: FaGift, title: 'Received Items', link: '/received-items', color: 'bg-green-500' },
      ];
    } else if (user?.role === 'ngo') {
      return [
        { icon: FaSearch, title: 'Browse Items', link: '/items', color: 'bg-blue-500' },
        { icon: FaHandshake, title: 'Manage Requests', link: '/requests', color: 'bg-purple-500' },
        { icon: FaChartLine, title: 'Impact Report', link: '/impact-report', color: 'bg-orange-500' },
      ];
    }
    return [];
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
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back to your KindKart dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaGift className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Donated</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.itemsDonated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaHandshake className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Received</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.itemsReceived}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaChartLine className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impact</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalImpact}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FaBell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRoleBasedActions().map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="ml-3 font-medium text-gray-900">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'donation' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'donation' ? (
                          <FaGift className="h-4 w-4 text-green-600" />
                        ) : (
                          <FaHandshake className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 