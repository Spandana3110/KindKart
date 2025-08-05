import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaChartLine, FaGift, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    itemsDonated: 0,
    itemsReceived: 0,
    totalImpact: 0,
    activeRequests: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        ngoName: user.ngoName || '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    // Simulate loading user stats
    setTimeout(() => {
      setStats({
        itemsDonated: user?.role === 'donor' ? 12 : 0,
        itemsReceived: user?.role === 'recipient' ? 8 : 0,
        totalImpact: user?.role === 'donor' ? 24 : user?.role === 'recipient' ? 16 : 0,
        activeRequests: 3,
      });
    }, 1000);
  }, [user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      donor: 'Donor',
      recipient: 'Recipient',
      ngo: 'NGO Representative',
      admin: 'Administrator'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      donor: 'bg-green-100 text-green-800',
      recipient: 'bg-blue-100 text-blue-800',
      ngo: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        disabled={!isEditing}
                        className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        disabled={!isEditing}
                        className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        disabled={!isEditing}
                        className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('location', { required: 'Location is required' })}
                        type="text"
                        disabled={!isEditing}
                        className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                  </div>

                  {/* NGO Name (conditional) */}
                  {user?.role === 'ngo' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NGO Name
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          {...register('ngoName')}
                          type="text"
                          disabled={!isEditing}
                          className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            !isEditing ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaSave className="mr-1" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUser className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getRoleColor(user?.role)}`}>
                  {getRoleDisplay(user?.role)}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-400" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>{user?.location}</span>
                </div>
                {user?.role === 'ngo' && (
                  <div className="flex items-center">
                    <FaBuilding className="mr-2 text-gray-400" />
                    <span>{user?.ngoName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaGift className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Items Donated</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.itemsDonated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaHandshake className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Items Received</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.itemsReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaChartLine className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm text-gray-600">Total Impact</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalImpact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaShieldAlt className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm text-gray-600">Active Requests</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.activeRequests}</span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Change Password
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Privacy Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 