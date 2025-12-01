const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//auth
exports.auth = async(req, res, next) => {
    //extract the token
    // console.log("req ke header me", req.headers);
    const token = req.cookies.token || 
                    req.body.token ||
                    req.header("authorisation").replace("Bearer ","");
                    // req.header("Authorization").split(" ")[1]
    
    //verify is token missing
    // console.log("req ke header ", req.header("authorization"));
    // console.log("cookies",req.cookies.token);
    // console.log("body", req.body.token);
    // console.log("token", token);
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is missing"
        })
    }

    //verify that token 
    try {
        console.log("token", token)
        // const decode = await jwt.verify(token, process.env.JWT_SECRET);
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
