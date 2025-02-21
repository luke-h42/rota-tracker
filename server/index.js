import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './Routes/authRoutes.js';
import adminRouter from './Routes/adminRoutes.js';
import shiftRouter from './Routes/shiftRoutes.js';
import userRouter from './Routes/userRoutes.js';
import subscribeRouter from './Routes/subscribeRoutes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';  // Import the serve-favicon package
import path from 'path';

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log('Database not connected', err));

// Server definitions and middlewares
const app = express();

// Serve the favicon.ico file
app.use(favicon(path.join('public', 'favicon.ico'))); 

app.use('/api/subscribe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Using routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/shifts', shiftRouter);
app.use('/api/users', userRouter);
app.use('/api/subscribe', subscribeRouter);

// Default route handler for root path `/`
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Server connection
app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});
