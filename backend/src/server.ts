// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import volunteerRoutes from './routes/volunteerRoutes';
import connectDB from './config/db';
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());


// Connect to MongoDB
connectDB();
app.use(cors());


// Sample route
app.get('/', (req, res) => {
  res.send('Disaster Management App API is running');
});

// Routes
app.use('/api', authRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
