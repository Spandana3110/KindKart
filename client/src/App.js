import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/create-item" element={
                <PrivateRoute>
                  <CreateItem />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/requests" element={
                <PrivateRoute>
                  <Requests />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 