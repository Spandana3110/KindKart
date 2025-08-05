import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaEye, FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { itemsAPI } from '../services/api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Books',
    'Furniture',
    'Toys',
    'Sports',
    'Kitchen',
    'Other'
  ];

  const conditions = [
    'All Conditions',
    'New',
    'Like New',
    'Good',
    'Fair',
    'Used'
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await itemsAPI.getAll();
        setItems(response.data.items || []);
        setFilteredItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Failed to load items');
        // Fallback to mock data if API fails
        const mockItems = [
          {
            id: 1,
            title: 'Children\'s Books Collection',
            description: 'A collection of 20 children\'s books in excellent condition. Perfect for young readers.',
            category: 'Books',
            condition: 'Good',
            location: 'New York, NY',
            donor: 'Sarah Johnson',
            images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
            createdAt: '2024-01-15',
            viewCount: 45,
            requestCount: 3,
          },
          {
            id: 2,
            title: 'Winter Jacket',
            description: 'Warm winter jacket, size M, barely used. Great for cold weather.',
            category: 'Clothing',
            condition: 'Like New',
            location: 'Boston, MA',
            donor: 'Mike Chen',
            images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
            createdAt: '2024-01-14',
            viewCount: 32,
            requestCount: 1,
          },
        ];
        setItems(mockItems);
        setFilteredItems(mockItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedCategory, selectedCondition, items]);

  const filterItems = () => {
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition && selectedCondition !== 'All Conditions') {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    setFilteredItems(filtered);
  };

  const handleRequestItem = (itemId) => {
    toast.success('Request sent successfully! The donor will be notified.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Donations</h1>
          <p className="text-gray-600">Find items you need from generous donors in your community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              <p className="text-sm text-gray-600">
                {filteredItems.length} items found
              </p>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              {/* Item Image */}
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                    <FaHeart className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.condition === 'New' ? 'bg-green-100 text-green-800' :
                    item.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
                    item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.condition}
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {item.viewCount}
                    </span>
                    <span>{item.requestCount} requests</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/items/${item.id}`}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRequestItem(item.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedCondition('');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items; 