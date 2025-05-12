import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import "dotenv/config";

const app = express();

// CORS middleware for all routes
app.use(cors({
    origin: process.env.CLIENT_URI || "https://emailsequence.vercel.app", // Allow only your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
}));

// Other middleware
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use('/api', router());

const startServer = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI!);
        console.log('Connected to MongoDB Atlas');

        const server = http.createServer(app);
        server.listen(process.env.PORT, () => {
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if DB connection fails
    }

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB runtime error:', error);
    });
};

startServer();

export default app