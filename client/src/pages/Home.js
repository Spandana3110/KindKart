import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHeart, 
  FaHandshake, 
  FaGlobe, 
  FaUsers, 
  FaRecycle, 
  FaShieldAlt,
  FaArrowRight,
  FaSearch,
  FaPlus
} from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaHandshake className="text-3xl" />,
      title: 'Easy Donation',
      description: 'List your unused items in minutes with our simple upload process.'
    },
    {
      icon: <FaSearch className="text-3xl" />,
      title: 'Smart Matching',
      description: 'Find items you need based on location and preferences.'
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'Community Building',
      description: 'Connect with neighbors and build stronger communities.'
    },
    {
      icon: <FaRecycle className="text-3xl" />,
      title: 'Environmental Impact',
      description: 'Reduce waste and promote sustainable living practices.'
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Safe & Secure',
      description: 'Verified users and secure communication channels.'
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: 'Global Reach',
      description: 'Join a worldwide community of givers and receivers.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaHeart className="text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Give What You Don't Need,
              <br />
              <span className="text-yellow-300">Help Who Needs It</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Join KindKart and become part of a global community that connects donors 
              with recipients, promoting sustainability and kindness worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <FaArrowRight />
                  </Link>
                  <Link
                    to="/items"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Browse Items
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/create-item"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaPlus />
                    <span>Donate Item</span>
                  </Link>
                  <Link
                    to="/items"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Browse Items
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KindKart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to give and receive items while building stronger communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of users making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25,000+</div>
              <div className="text-gray-600">Items Donated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start your journey of giving and receiving today. Every item donated 
            makes someone's life better and our planet cleaner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Join KindKart
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/create-item"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Donate an Item
                </Link>
                <Link
                  to="/items"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Browse Items
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 