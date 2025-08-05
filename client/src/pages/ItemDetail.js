import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaEye, FaHeart, FaUser, FaPhone, FaEnvelope, FaArrowLeft, FaShare } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    // Simulate loading item details
    setTimeout(() => {
      const mockItem = {
        id: parseInt(id),
        title: 'Children\'s Books Collection',
        description: 'A wonderful collection of 20 children\'s books in excellent condition. These books are perfect for young readers aged 5-12 and include a mix of educational and entertaining stories. The collection includes classics like "The Very Hungry Caterpillar", "Where the Wild Things Are", and many more beloved titles. All books are in good condition with no missing pages or significant damage. Perfect for families, schools, or community centers looking to build their children\'s library.',
        category: 'Books',
        condition: 'Good',
        location: 'New York, NY',
        donor: {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          rating: 4.8,
          itemsDonated: 15,
        },
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
        ],
        createdAt: '2024-01-15',
        viewCount: 45,
        requestCount: 3,
        dimensions: 'Various sizes',
        tags: ['children', 'education', 'reading', 'learning'],
        pickupPreferences: 'Flexible - can arrange pickup or drop-off',
        expiryDate: '2024-02-15',
      };
      setItem(mockItem);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleRequest = () => {
    if (!user) {
      toast.error('Please log in to request this item');
      return;
    }
    setShowRequestModal(true);
  };

  const submitRequest = () => {
    if (!requestMessage.trim()) {
      toast.error('Please add a message to your request');
      return;
    }
    
    toast.success('Request sent successfully! The donor will be notified.');
    setShowRequestModal(false);
    setRequestMessage('');
  };

  const shareItem = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this item on KindKart: ${item.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <Link to="/items" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Browse Other Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/items"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex space-x-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={shareItem}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaShare />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FaHeart />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  {item.location}
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  {item.viewCount} views
                </span>
              </div>

              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                item.condition === 'New' ? 'bg-green-100 text-green-800' :
                item.condition === 'Like New' ? 'bg-blue-100 text-blue-800' :
                item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.condition} Condition
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Dimensions</h4>
                <p className="text-gray-600">{item.dimensions}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Pickup Preferences</h4>
                <p className="text-gray-600">{item.pickupPreferences}</p>
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Donor Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Donor</h3>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={item.donor.avatar}
                  alt={item.donor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.donor.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{item.donor.rating}</span>
                    <span className="ml-2">• {item.donor.itemsDonated} items donated</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-400" />
                  <span>{item.donor.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  <span>{item.donor.email}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleRequest}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Request This Item
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium">
                Contact Donor
              </button>
            </div>

            {/* Request Count */}
            <div className="text-center text-sm text-gray-500">
              {item.requestCount} other people have requested this item
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Item</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {item.donor.name} explaining why you need this item.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Tell the donor why you need this item..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              rows={4}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail; 