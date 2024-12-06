import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './Routes/authRoutes.js'
import adminRouter from './Routes/adminRoutes.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log('Database not connected', err))

//server definitions and middlewares
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

//using routes
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

//server connection
app.listen(5000, () => {
    console.log("server running on localhost:5000")
})