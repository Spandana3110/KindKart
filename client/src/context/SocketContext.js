import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket', 'polling']
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Custom events
      newSocket.on('request_received', (data) => {
        toast.success(`New request received for ${data.itemTitle}!`);
      });

      newSocket.on('request_accepted', (data) => {
        toast.success(`Your request for ${data.itemTitle} was accepted!`);
      });

      newSocket.on('request_rejected', (data) => {
        toast.error(`Your request for ${data.itemTitle} was rejected.`);
      });

      newSocket.on('request_completed', (data) => {
        toast.success(`Request completed for ${data.itemTitle}!`);
      });

      newSocket.on('new_message', (data) => {
        toast.success(`New message from ${data.senderName}!`);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Join user to their personal room
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('join_user_room', { userId: user._id });
    }
  }, [socket, isConnected, user]);

  // Send message function
  const sendMessage = (requestId, message) => {
    if (socket && isConnected) {
      socket.emit('send_message', { requestId, message });
    }
  };

  // Join request room
  const joinRequestRoom = (requestId) => {
    if (socket && isConnected) {
      socket.emit('join_request_room', { requestId });
    }
  };

  // Leave request room
  const leaveRequestRoom = (requestId) => {
    if (socket && isConnected) {
      socket.emit('leave_request_room', { requestId });
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    joinRequestRoom,
    leaveRequestRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 