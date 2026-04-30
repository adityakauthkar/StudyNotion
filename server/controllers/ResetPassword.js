const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.resetPasswordToken = async(req, res) => {
    //resetPasswordToken
    try {
        //get email from req ki body
        const {email} = req.body;

        //check user for that email, validate email 
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required, Please enter the email"
            })
        }
        //console.log("here is the email", email);
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email`,
            })
        }
        //generate token

        // const token = crypto.randomUUID();
        const token = crypto.randomBytes(20).toString('hex');

        //update the user by adding this token and expiry time
        const updateUser = await User.findOneAndUpdate({email: email},
                                {
                                    token: token,
                                    resetPasswordExpire: Date.now() + 5*60*1000, //5 minutes
                                }, {new: true});//new: true => ye updated user print karvayega
        //create url
        const url = `http://localhost:3000/update-password/${token}`

        //send mail containing url
        mailSender(email,  
                    "Password Reset Link", 
                    `Password Reset Link: ${url}`);
        //return response
        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check email and changed password"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        })
    }
}


//resetPassword

exports.resetPassword = async(req, res) => {
    try {
         //data fetch
         const {password, confirmPassword, token} = req.body;

         //validation
         if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password is not matching",
            })
         }
         //get userdetails from db using token
         console.log("token", token);
         const user = await User.find({token: token});
         console.log("user", user);

         //if no entry - invalid token
         if(!user){
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
         }

         //token time check
         if(user.resetPasswordExpire < Date.now()){
            return res.status(402).json({
                success: false,
                message: "token is expired, please regenerate token",
            })
         }
         //hash the password
         console.log("heree password", password);
         const hashedPassword = await bcrypt.hash(password, 10);

         //update password
         const userId = user[0]._id;
         const updatePass = await User.findByIdAndUpdate(userId,
                                                {password: hashedPassword},
                                                {new: true})
         //return response
            return res.status(200).json({
                success: true,
                message: "Password reset successfull",
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while sending reset password email"
        })
    }
}