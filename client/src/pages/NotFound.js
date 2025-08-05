import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 