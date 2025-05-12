import express from "express";
import http from "http";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import mongoose from "mongoose";
import router from "./router";
import "dotenv/config"

const app = express();

// Apply CORS middleware before defining routes
app.use(cors({
    origin: process.env.CLIENT_URI || "https://emailsequence.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

app.options('*', cors({
    origin: process.env.CLIENT_URI || "https://emailsequence.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Other middleware
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Create server
const server = http.createServer(app);

mongoose.Promise = Promise;
mongoose.connect(process.env.ATLAS_URI!)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('MongoDB connection error:', error));

mongoose.connection.on('error', (error) => console.log('MongoDB connection error:', error));

// Routes
app.use('/api', router());

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});