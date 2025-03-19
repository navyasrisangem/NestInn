import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// Verify both admin and client tokens
export const verifyToken = (req, res, next) => {
    const token = req.cookies.adminToken || req.cookies.clientToken;

    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));

        req.user = user;
        next();
    });
};

// Verify user token
export const verifyUser = (req, res, next) => {
    const token = req.cookies.adminToken || req.cookies.clientToken; 
    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));

        if (user.id === req.params.id || user.isAdmin) {
            req.user = user;
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};

// Verify admin token only
export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;  // Only admin token

    if (!token) {
        return next(createError(403, "Admin authentication required!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Admin token is not valid!"));
//    console.log(user.isAdmin);
        if (user.isAdmin) {
            req.user = user;
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};
