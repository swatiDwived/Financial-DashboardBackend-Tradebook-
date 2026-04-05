// Middleware in Express runs before the final route logic and can decide whether to allow or block the request.

// The Authorization header is a special part of an HTTP request that your frontend sends to the backend to prove the user is authenticated (i.e., logged in).
// The Header usually looks like : 
// Authorization: Bearer <token_here>

//  JWT Authentication Middleware — this will protect routes like /api/trades so that only logged-in users can access them.

//  Purpose of This File:
// This function is commonly used to protect routes by verifying JWT tokens.


import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';


export const protect = async (req, res, next) => {
    try {
        //1.Get token from header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided, authorization denied" });
        }

        //2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //3. Attach userID to request
        req.userId = decoded.id;

        //  Debug log
        console.log("Token decoded, userId:", req.userId);

        //4.Proceed to next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token verification Failed" });
    }
};
