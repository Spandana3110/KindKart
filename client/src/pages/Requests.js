import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes, FaEye, FaComment, FaClock, FaMapMarkerAlt, FaUser, FaGift } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Requests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simulate loading requests
    setTimeout(() => {
      const mockRequests = [
        {
          id: 1,
          item: {
            id: 1,
            title: 'Children\'s Books Collection',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150',
            category: 'Books',
          },
          requester: {
            id: 2,
            name: 'John Smith',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            location: 'Brooklyn, NY',
          },
          donor: {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          },
          status: 'pending',
          message: 'I would love these books for my classroom. I teach 2nd grade and these would be perfect for my students.',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          messages: [
            {
              id: 1,
              sender: 'requester',
              message: 'I would love these books for my classroom. I teach 2nd grade and these would be perfect for my students.',
              timestamp: '2024-01-15T10:30:00Z',
            },
          ],
        },
        {
          id: 2,
          item: {
            id: 2,
            title: 'Winter Jacket',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150',
            category: 'Clothing',
          },
          requester: {
            id: 3,
            name: 'Maria Garcia',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            location: 'Queens, NY',
          },
          donor: {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          },
          status: 'accepted',
          message: 'This jacket would be perfect for my daughter. She\'s been needing a warm winter coat.',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
          messages: [
            {
              id: 1,
              sender: 'requester',
              message: 'This jacket would be perfect for my daughter. She\'s been needing a warm winter coat.',
              timestamp: '2024-01-14T14:20:00Z',
            },
            {
              id: 2,
              sender: 'donor',
              message: 'That sounds perfect! I\'m happy to help. When would you like to pick it up?',
              timestamp: '2024-01-15T09:15:00Z',
            },
          ],
        },
        {
          id: 3,
          item: {
            id: 3,
            title: 'Laptop Stand',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150',
            category: 'Electronics',
          },
          requester: {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          },
          donor: {
            id: 4,
            name: 'Emily Davis',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          },
          status: 'completed',
          message: 'This would be great for my home office setup. I\'ve been looking for something like this.',
          createdAt: '2024-01-13T16:45:00Z',
          updatedAt: '2024-01-16T11:30:00Z',
          messages: [
            {
              id: 1,
              sender: 'requester',
              message: 'This would be great for my home office setup. I\'ve been looking for something like this.',
              timestamp: '2024-01-13T16:45:00Z',
            },
            {
              id: 2,
              sender: 'donor',
              message: 'Great! I can meet you at the library tomorrow at 2 PM.',
              timestamp: '2024-01-14T10:20:00Z',
            },
            {
              id: 3,
              sender: 'requester',
              message: 'Perfect! I\'ll be there. Thank you so much!',
              timestamp: '2024-01-14T11:15:00Z',
            },
          ],
        },
      ];
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplay = (status) => {
    const displayMap = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return displayMap[status] || status;
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    toast.success(`Request ${newStatus} successfully`);
  };

  const openChat = (request) => {
    setSelectedRequest(request);
    setShowChatModal(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.id === selectedRequest.requester.id ? 'requester' : 'donor',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setSelectedRequest({
      ...selectedRequest,
      messages: [...selectedRequest.messages, newMessage],
    });

    setMessage('');
    toast.success('Message sent!');
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'received') {
      return req.donor.id === user?.id;
    } else {
      return req.requester.id === user?.id;
    }
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests</h1>
          <p className="text-gray-600">Manage your donation requests and communications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received Requests
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sent Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <img
                    src={request.item.image}
                    alt={request.item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.item.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {request.item.category}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusDisplay(request.status)}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <img
                          src={activeTab === 'received' ? request.requester.avatar : request.donor.avatar}
                          alt={activeTab === 'received' ? request.requester.name : request.donor.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {activeTab === 'received' ? request.requester.name : request.donor.name}
                        </span>
                      </div>
                      <span className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1" />
                        {activeTab === 'received' ? request.requester.location : request.donor.location}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {request.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openChat(request)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <FaComment className="mr-1" />
                        Chat ({request.messages.length} messages)
                      </button>
                      
                      {activeTab === 'received' && request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'accepted')}
                            className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700"
                          >
                            <FaCheck className="mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                          >
                            <FaTimes className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}

                      {request.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'completed')}
                          className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <FaGift className="mr-1" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FaGift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} requests
              </h3>
              <p className="text-gray-500">
                {activeTab === 'received' 
                  ? 'You haven\'t received any requests yet.' 
                  : 'You haven\'t sent any requests yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={selectedRequest.item.image}
                    alt={selectedRequest.item.title}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedRequest.item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'received' ? selectedRequest.requester.name : selectedRequest.donor.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedRequest.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === (user?.id === selectedRequest.requester.id ? 'requester' : 'donor') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === (user?.id === selectedRequest.requester.id ? 'requester' : 'donor')
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests; 