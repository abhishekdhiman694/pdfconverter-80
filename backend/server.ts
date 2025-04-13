
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdfZenith';
const client = new MongoClient(uri);

// Database and collections
let db: any;
let usersCollection: any;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db('pdfZenith');
    usersCollection = db.collection('users');
    
    // Create indexes for better query performance
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    console.log('Database initialized');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// API Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      email,
      username,
      password, // In a real app, you should hash the password
      convertCount: 0,
      createdAt: new Date()
    };
    
    await usersCollection.insertOne(newUser);
    
    // Don't send password back
    delete newUser.password;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await usersCollection.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Don't send password back
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      convertCount: user.convertCount
    };
    
    res.status(200).json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update conversion count
app.post('/api/conversions/:email/increment', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await usersCollection.updateOne(
      { email },
      { $inc: { convertCount: 1 } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = await usersCollection.findOne({ email });
    
    res.status(200).json({
      message: 'Conversion count updated',
      convertCount: updatedUser.convertCount
    });
  } catch (error) {
    console.error('Update conversion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset conversion count
app.post('/api/conversions/:email/reset', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await usersCollection.updateOne(
      { email },
      { $set: { convertCount: 0 } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Conversion count reset',
      convertCount: 0
    });
  } catch (error) {
    console.error('Reset conversion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user data
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't send password back
    delete user.password;
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize and start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
