# KindKart - Unused Item Donation Platform

> **"Give What You Don't Need, Help Who Needs It"**

KindKart is a comprehensive MERN stack application that connects donors with recipients to facilitate the donation of unused items. The platform promotes sustainability, community building, and social impact through item sharing.

## 🌟 Features

### User Management
- **Multi-role System**: Donors, Recipients, NGOs, and Admins
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Profile Management**: Complete user profiles with location tracking
- **NGO Support**: Special registration for verified organizations

### Donation Workflow
- **Item Listing**: Upload photos, add details, set pickup preferences
- **Smart Categorization**: Clothing, Electronics, Books, Furniture, Toys, Kitchen, Sports, Beauty, Automotive, Other
- **Condition Tracking**: New, Like-new, Excellent, Good, Fair, Poor
- **Location-based Matching**: Find items by city and state

### Request System
- **Request Management**: Recipients can request items with messages
- **Status Tracking**: Available → Requested → Accepted → Completed
- **Communication**: In-app messaging between donors and recipients
- **Pickup Coordination**: Schedule and coordinate item pickups

### Advanced Features
- **Real-time Chat**: Socket.IO powered messaging
- **Image Upload**: Cloudinary integration for item photos
- **Search & Filters**: Advanced search with category and location filters
- **Impact Tracking**: User statistics and community leaderboards
- **Admin Panel**: Complete moderation and analytics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
kindkart/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── items.js
│   │   ├── requests.js
│   │   ├── chat.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   └── index.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Items
- `GET /api/items` - Get all available items (with filters)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item (donors only)
- `PUT /api/items/:id` - Update item (owner only)
- `DELETE /api/items/:id` - Delete item (owner or admin)
- `GET /api/items/user/:userId` - Get user's items
- `POST /api/items/:id/images` - Upload item images
- `DELETE /api/items/:id/images/:imageId` - Delete item image

### Requests
- `POST /api/requests` - Create item request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/received` - Get received requests (donors)
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id/status` - Update request status
- `POST /api/requests/:id/messages` - Send message
- `PUT /api/requests/:id/complete` - Complete request

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/:id/items` - Get user's items
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/leaderboard/top-donors` - Get leaderboard
- `GET /api/users/search` - Search users
- `PUT /api/users/preferences` - Update preferences
- `DELETE /api/users/account` - Delete account

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `PUT /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/items` - Manage items
- `PUT /api/admin/items/:id/moderate` - Moderate item
- `DELETE /api/admin/items/:id` - Delete item (admin)
- `GET /api/admin/requests` - Manage requests
- `GET /api/admin/analytics` - Get analytics

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **Socket.IO** - Real-time communication
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend (Coming Soon)
- **React.js** - Frontend framework
- **TailwindCSS** - Styling
- **Socket.IO Client** - Real-time features
- **React Router** - Navigation
- **Axios** - HTTP client

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **File Upload Validation** for images only
- **Role-based Authorization** for different user types

## 📊 Database Models

### User Model
- Basic info (name, email, password)
- Role (donor, recipient, ngo, admin)
- Location with coordinates
- Profile picture and bio
- Statistics tracking
- Preferences and privacy settings
- NGO-specific details

### Item Model
- Item details (title, description, category, condition)
- Image management with primary image
- Location and pickup preferences
- Status tracking
- View and request counts
- Expiry dates
- Tags for search

### Request Model
- Item and user references
- Status management
- Communication history
- Pickup coordination
- Completion tracking
- Feedback system

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set secure JWT secret
4. Configure Cloudinary for image storage
5. Set up email service
6. Configure CORS for production domain

### Environment Variables
All configuration is handled through environment variables. See `.env.example` for required variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for the community
- Inspired by the need for sustainable item sharing
- Designed to promote kindness and reduce waste

---

**KindKart** - Making the world a better place, one donation at a time. 