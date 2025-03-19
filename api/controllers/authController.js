import User from "../models/User.js";
import bcrypt from "bcrypt";
import {createError} from "../utils/error.js";
import jwt from "jsonwebtoken";

//register
export const register = async(req,res,next)=> {

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            country: req.body.country,
            city: req.body.city,
            phone: req.body.phone,
            img: req.body.img, // Cloudinary image URL
          });
        
        await newUser.save();
        res.status(200).send("User created Succesfully!");
    } catch (err) {
        next(err);
    }
};

//login
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        // Generate token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT,
            { expiresIn: "1h" }
        );

        const { password, ...otherDetails } = user._doc;

        // Set the correct token cookie
        if (user.isAdmin) {
            res.cookie("adminToken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
        } else {
            res.cookie("clientToken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
        }

        res.status(200).json({ details: { ...otherDetails }, isAdmin: user.isAdmin });
    } catch (err) {
        next(err);
    }
};


//logout
export const logout = async (req, res) => {
    const { userType } = req.body;  // Send userType from the frontend

    if (userType === "admin" && req.cookies.adminToken) {
        res.clearCookie("adminToken", { httpOnly: true, secure: false, sameSite: "lax" });
        return res.status(200).json({ message: "Admin logged out successfully" });
    }

    if (userType === "client" && req.cookies.clientToken) {
        res.clearCookie("clientToken", { httpOnly: true, secure: false, sameSite: "lax" });
        return res.status(200).json({ message: "Client logged out successfully" });
    }

    return res.status(400).json({ message: "No active session found" });
};


