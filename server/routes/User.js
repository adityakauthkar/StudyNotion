const express = require("express");
const router = express.Router();


const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");

const {resetPassword, resetPasswordToken} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");



//Route for user login
router.post("/login", login);


//route for user signup
router.post("/signup", signUp);


//route for changing password
router.post("/changepassword", auth, changePassword);





//route for reset password
router.post("/resetpassword", resetPassword);

//route for reset password token
router.post("/resetpasswordtoken", resetPasswordToken);


//route for contact us



//exporting the router
module.exports = router;