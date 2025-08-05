# KindKart Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kindkart
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/kindkart
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:3000
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Socket.IO Configuration
   SOCKET_CORS_ORIGIN=http://localhost:3000
   ```

   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## Available Scripts

- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run build` - Build the client for production
- `npm run install-all` - Install dependencies for both server and client

## Features Implemented

### Backend (Complete)
- ✅ User authentication with JWT
- ✅ User registration and login
- ✅ Item management (CRUD operations)
- ✅ Request system for items
- ✅ Real-time messaging with Socket.IO
- ✅ File upload handling
- ✅ Admin panel with analytics
- ✅ Role-based authorization
- ✅ Input validation and error handling
- ✅ Security middleware (helmet, rate limiting, CORS)

### Frontend (Basic Structure)
- ✅ React application setup
- ✅ Routing with React Router
- ✅ Authentication context
- ✅ Socket.IO integration
- ✅ Tailwind CSS styling
- ✅ Responsive navigation
- ✅ Home page with hero section
- ✅ Login page with form validation
- ✅ Placeholder pages for all routes

## Next Steps

1. **Complete Frontend Implementation**
   - Registration form
   - Item browsing and filtering
   - Item creation form
   - User profile management
   - Request management interface
   - Admin dashboard

2. **Additional Features**
   - Google OAuth integration
   - Email notifications
   - Image upload to Cloudinary
   - Advanced search and filtering
   - Real-time chat interface
   - Mobile app development

3. **Production Deployment**
   - Set up production MongoDB
   - Configure environment variables
   - Set up CI/CD pipeline
   - Deploy to cloud platform

## API Documentation

The backend API is fully implemented with the following endpoints:

- **Authentication**: `/api/auth/*`
- **Items**: `/api/items/*`
- **Requests**: `/api/requests/*`
- **Users**: `/api/users/*`
- **Admin**: `/api/admin/*`

See the README.md file for complete API documentation.

## Support

For questions or issues, please refer to the README.md file or create an issue in the repository. 