const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock data storage
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'donor',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    bio: 'I love helping others through donations.',
    stats: {
      itemsDonated: 5,
      itemsReceived: 0,
      totalImpact: 10
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'recipient',
    location: 'Boston, MA',
    phone: '+1 (555) 987-6543',
    bio: 'Looking for items to help my family.',
    stats: {
      itemsDonated: 0,
      itemsReceived: 3,
      totalImpact: 6
    }
  }
];

const items = [
  {
    id: '1',
    title: 'Children\'s Books Collection',
    description: 'A collection of 20 children\'s books in excellent condition. Perfect for young readers.',
    category: 'Books',
    condition: 'Good',
    location: 'New York, NY',
    donor: '1',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    createdAt: '2024-01-15',
    viewCount: 45,
    requestCount: 3,
    status: 'available'
  },
  {
    id: '2',
    title: 'Winter Jacket',
    description: 'Warm winter jacket, size M, barely used. Great for cold weather.',
    category: 'Clothing',
    condition: 'Like New',
    location: 'Boston, MA',
    donor: '1',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
    createdAt: '2024-01-14',
    viewCount: 32,
    requestCount: 1,
    status: 'available'
  }
];

// Simple JWT-like token generation
const generateToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Simple token validation (in real app, this would verify JWT)
  const userId = token.split('-')[3];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  req.user = user;
  next();
};

// API Routes
// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, location, phone } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // In real app, hash password
    role,
    location,
    phone,
    bio: '',
    stats: {
      itemsDonated: 0,
      itemsReceived: 0,
      totalImpact: 0
    }
  };

  users.push(newUser);
  
  const token = generateToken(newUser.id);
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { ...newUser, password: undefined }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // In real app, verify password hash
  if (password !== 'password') {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  res.json({
    message: 'Login successful',
    token,
    user: { ...user, password: undefined }
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ ...req.user, password: undefined });
});

// Items routes
app.get('/api/items', (req, res) => {
  const availableItems = items.filter(item => item.status === 'available').map(item => ({
    ...item,
    donor: {
      id: item.donor,
      name: item.donorName || 'Unknown Donor'
    }
  }));
  
  res.json({
    items: availableItems,
    total: availableItems.length
  });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  const donor = users.find(u => u.id === item.donor);
  res.json({
    ...item,
    donor: donor ? { ...donor, password: undefined } : { id: item.donor, name: item.donorName || 'Unknown Donor' }
  });
});

app.post('/api/items', auth, (req, res) => {
  const { title, description, category, condition, location, pickupPreferences, dimensions, tags } = req.body;
  
  const newItem = {
    id: (items.length + 1).toString(),
    title,
    description,
    category,
    condition,
    location,
    donor: req.user.id,
    donorName: req.user.name,
    images: [],
    createdAt: new Date().toISOString(),
    viewCount: 0,
    requestCount: 0,
    status: 'available',
    dimensions: dimensions || '',
    tags: tags || [],
    pickupPreferences: pickupPreferences || 'Flexible'
  };

  items.push(newItem);
  res.status(201).json({
    message: 'Item created successfully',
    item: newItem
  });
});

// Users routes
app.get('/api/users/profile', auth, (req, res) => {
  res.json({ ...req.user, password: undefined });
});

app.put('/api/users/profile', auth, (req, res) => {
  const { name, email, phone, location, bio } = req.body;
  
  Object.assign(req.user, { name, email, phone, location, bio });
  
  res.json({
    message: 'Profile updated successfully',
    user: { ...req.user, password: undefined }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KindKart API is running (Mock Mode)',
    timestamp: new Date().toISOString()
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any route not handled by above, serve index.html (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler (for API only, not frontend)
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`KindKart server running on port ${PORT} (Mock Mode)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Demo credentials:');
  console.log('Email: john@example.com, Password: password');
  console.log('Email: jane@example.com, Password: password');
}); 