const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//auth
exports.auth = async(req, res, next) => {
        const authHeader = req.header("Authorization") || null;

 const token = req.cookies.token || req.body.token || (authHeader ? authHeader.replace("Bearer ", "") : null);

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is missing"
        })
    }

    //verify that token 
    try {
        console.log("token", token)
      
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decode", decode);
        req.user = decode;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Token is invalid",
        })
    }
    next();
}

//isStudent

exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            res.status(401).json({
                success: false,
                message: "This is protected route for students only",
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified please try again",
        })
    }

}

//isInstructor

exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is protected route only for Instructor"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try again"
        })
    }
}

//isAdmin

exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route only for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try again"
        })
    }
}
