import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

//resolving dirname for esmodule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.set("trust proxy", 1);  // Trust Render's proxy to handle cookies correctly

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

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

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

//  Serve static images
app.use("/images", express.static(path.join(__dirname, "/client/public/images")));

//use the client and admin app
app.use("/client", express.static(path.join(__dirname, "/client/dist")));
app.use("/admin", express.static(path.join(__dirname, "/admin/build")));

//render client and admin for any path
app.get("/client/*", (req,res) => res.sendFile(path.join(__dirname, "/client/dist/index.html")));
app.get("/admin/*", (req,res) => res.sendFile(path.join(__dirname, "/admin/build/index.html")));

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
