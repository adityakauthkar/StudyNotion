const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//sendOTP
exports.sendOTP = async(req, res) =>{
    try {
        
        //sendOTP

    //fetch email from req ki body
    const {email} = req.body;
    console.log("phoneNumber", email)
    const Email = email.email;
    console.log("email", email);
    //validate email fill or not
    if(!Email){
        return res.status(401).json({
            success: false,
            message: "please enter the Email"
        })
    }

    //then validate is Email already exists
    const checkUserExists = await User.findOne({Email})
    console.log("checkuserexists", checkUserExists)
    //if exists then return a response
    if(checkUserExists){
        return res.status(401).json({
            success: false,
            message: "User already registered"
        })
    }

    //if not exists then genetate otp
    var otp =  otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })

    //now check wheather that otp is already exists in db

    const result = await Otp.findOne({otp: otp});
    console.log('result', result)

    //if yes then again generate new otp
    while(result){
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        result = await Otp.findOne({otp: otp});
    }

    const otpPayload = {Email, otp};
    console.log("otpPayload", otpPayload);
    //if not then create entry in db with Email and otp
    const otpBody = await Otp.create(
        {email: otpPayload.Email,
        otp: otp,}
    );
    console.log("otpBody", otpBody);

    //send the response
    res.status(200).json({
        success: true,
        message: "OTP sent Successfully",
        otpPayload
    })


    } catch (error) {
        console.log("error occured while generating otp", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

//signUp
exports.signUp = async(req, res) =>{
    try {
         //signUp

    //data fetch from req body
    console.log("req.body", req.body)
    const {
        firstName, lastName, email,phoneNumber, password, confirmPassword, accountType,
        contactNumber, otp, 
    } = req.body;
    console.log("phoneNumber", phoneNumber)

    //validate karlo data ko
        if(!firstName || !lastName || !email || !password ||
            !confirmPassword || !otp){
                return res.status(403).json({
                    success: false,
                    message: "All fields are required",
                })
            }
    //2 password ko match karlo
    if(password != confirmPassword){
        return res.status(400).json({
            success: false,
            message:"Password and Confirm password value does not match, please try again"
        })
    }
    //check user already exists or not
    const existingUser = await User.findOne({email});
    console.log("existingUser", existingUser)
    if(existingUser){
        //user already exists hai
        return res.status(401).json({
            success: false,
            message: "User already registered",
        })
    }
    //find most recent OTP stored for that user
    // const recentOTP = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1);
    const recentOTP = await Otp.find({email}).sort({createdAt: -1}).limit(1);
    console.log("recentOTP", recentOTP);

    //validate otp with otp send in mail
    if(recentOTP.length === 0){
        //otp not found
        return res.status(400).json({
            success: false,
            message: "OTP Not Found",
        })
    }
    const otpObject = recentOTP[0];
    console.log("otpObject", otpObject.email, otpObject.otp);
    
    if(otp != otpObject.otp){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        })
    }

    console.log("userotp", otp)
    //hash karlo password ko

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword)

    //db me entry create karlo

    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        contactNumber: null,
        about: null,
    })

    console.log("profileDetails", profileDetails)

    // const user = await User.create({
    //     firstName,
    //     lastName,
    //     email,
    //     password: hashedPassword,
    //     contactNumber,
    //     accountType,
    //     additionDetails: profileDetails._id,
    //     image: `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}+${response.data.user.lastName}`
    // })
    //return response

    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        contactNumber,
        accountType,
        additionDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}`
    })
    
    console.log("userdata", user);

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
        //get data from req body

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
        //agar password match hua to hi ham jwt generate karenge
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

//changePassword =>check this controller of home work
exports.changePassword = async(req, res) =>{
    try {
        //get data from req body
    const {oldPassword, newPassword, confirmPassword} = req.body;
    console.log("req.body", req.body);

    //get old password, new password, confirm password
    //validate data
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
    //if user exists the
    const users = await User.findById(user?.id);
    console.log("users", users);
    //match old password
    // console.log(oldPassword, user);

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
    //hash new password
    // console.log("before hashed", newPassword)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // console.log("after hashed", hashedPassword)
    //update password in db
    users.password = hashedPassword;
    users.save();
    const updated = await User.findById(user.id);
    console.log("updated pass",updated )
    //send mail to user = password changed successfully
    // mailSender(user.email, "Password Changed Successfully", "Your password has been changed successfully !!!");
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