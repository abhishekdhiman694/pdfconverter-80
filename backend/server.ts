
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    note: 'Using Supabase for database operations'
  });
});

// Legacy API routes (now will return messages about using Supabase)
const supabaseMessage = {
  message: 'This endpoint is now handled by Supabase. Please use the Supabase client in the frontend.'
};

app.post('/api/register', (req, res) => {
  res.status(200).json({ ...supabaseMessage });
});

app.post('/api/login', (req, res) => {
  res.status(200).json({ ...supabaseMessage });
});

app.post('/api/conversions/:email/increment', (req, res) => {
  res.status(200).json({ ...supabaseMessage });
});

app.post('/api/conversions/:email/reset', (req, res) => {
  res.status(200).json({ ...supabaseMessage });
});

app.get('/api/users/:email', (req, res) => {
  res.status(200).json({ ...supabaseMessage });
});

// Initialize and start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
