import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHeart, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaPlus,
  FaInbox,
  FaCog,
  FaChartBar
} from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaHeart className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gradient">KindKart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/items"
              className={`text-sm font-medium transition-colors ${
                isActive('/items') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Items
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/admin') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                {/* Create Item Button */}
                <Link
                  to="/create-item"
                  className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaPlus className="text-xs" />
                  <span>Donate Item</span>
                </Link>

                {/* User Menu Button */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-600" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.name}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="text-gray-400" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/requests"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaInbox className="text-gray-400" />
                      <span>Requests</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaChartBar className="text-gray-400" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/items"
                className={`text-sm font-medium transition-colors ${
                  isActive('/items') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Items
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/create-item"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPlus className="text-xs" />
                    <span>Donate Item</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/requests"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/requests') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Requests
                  </Link>
                  <Link
                    to="/profile"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin') 
                          ? 'text-blue-600' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 