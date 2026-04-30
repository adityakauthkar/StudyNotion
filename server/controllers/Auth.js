const User = require("../models/User");
// const Otp = require("../models/Otp");
// const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//signUp
exports.signUp = async(req, res) =>{
    try {
    const {
        firstName, lastName, email,phoneNumber, password, confirmPassword, accountType,
    
    } = req.body;
  

        if(!firstName || !lastName || !email || !password ||
            !confirmPassword ){
                return res.status(403).json({
                    success: false,
                    message: "All fields are required",
                })
            }
    
    if(password != confirmPassword){
        return res.status(400).json({
            success: false,
            message:"Password and Confirm password value does not match, please try again"
        })
    }

    const existingUser = await User.findOne({email});
    
    if(existingUser){
        return res.status(401).json({
            success: false,
            message: "User already registered. Please Login",
        })
    }
   

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({   
        gender: null,
        dateOfBirth: null,
        about: null,
    })

    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        accountType,
        additionDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}`
    })
    
   

    return res.status(200).json({
        success: true,
        user,
        message: "User is Registered successfully",
    })
    } catch (error) {
        console.log("error occured while user registration", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again",
        })
    }
}

//logIn
exports.login = async(req, res) => {
    try {
    const {email, password} = req.body;

    //validation of data
    if(!email || !password){
        return res.status(403).json({
            success: false,
            message: "All fields are required, please try again",
        })
    }
    //check user exists or not 
    const user = await User.findOne({email}).populate("additionDetails");
    // console.log("user", user);
    
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User is not registerd, Please Sign up first",
        })
    }

    //generate json web token after password match
    if(await bcrypt.compare(password, user.password)){
        
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "48h",
        });

        user.token = token;
        user.password = undefined;

        //create cookie and send it into response
        const options = {
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User Logged in successfully",
        })
    }
    else{
        return res.status(401).json({
            success: false,
            message: "Password is incorrect",
        })
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again"
        });
    }
    
}


exports.changePassword = async(req, res) =>{
    try {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    console.log("req.body", req.body);

    
    if(!oldPassword || !newPassword || !confirmPassword){
        return res.status(403).json({
            success: false,
            message: "All fields are required, please try again",
        })
    }
    //check user exists or not
    const user = req.user;
    //if user not exists call db by using email id in cookie
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found, Please login first",
        })
    }
    const users = await User.findById(user?.id);
    console.log("users", users);
    

    const result = await bcrypt.compare(oldPassword, users.password);
    console.log("result", result);
    if(!result){
        return res.status(401).json({
            success: false,
            message: "Old password is incorrect",
        })
    }
    //if password match then
    console.log("here", result, "password", newPassword, confirmPassword);
    if(newPassword != confirmPassword){
        return res.status(400).json({
            success: false,
            message: "New password and confirm password does not match, please try again",
        })
    }
   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    users.password = hashedPassword;
    users.save();
    const updated = await User.findById(user.id);
    console.log("updated pass",updated )
   
    const mailResponse = await mailSender(
        user?.email,
        `Password Changed Successfully`,
        passwordUpdated(user?.email, users?.firstName)
    )
    console.log("mailresponse", mailResponse)
    //return response
    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    })
    } catch (error) {
        console.log("error occured while changing password", error);
        return res.status(500).json({
            success: false,
            message: "Password cannot be changed, please try again",
        })
    }
}