import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", ()=> {
    console.log("mongoDB disconnected!");
});

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://nestinn-client.onrender.com"];

//middlewares

app.use(
    cors({
        origin: allowedOrigins, // Allow requests from these origins
        credentials: true, // Allow credentials (cookies)
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(cookieParser());
app.use(express.json()); 

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err,req,res,next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Internal server error";
    return res.status(errorStatus).json({ 
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });  //stack is for developer to know where the error is
});


const PORT = process.env.PORT || 8800;
app.listen(PORT, ()=> {
    connect();
    console.log("Connected to backend.");
})
