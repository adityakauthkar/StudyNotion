const express = require('express');
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail

} = require('../controllers/Payments');


const {auth , isStudent, isAdmin} = require("../middlewares/auth");

//route for creating payment
router.post("/capturepayment", auth, isStudent, capturePayment);

//route for verifying signature
router.post("/verifysignature",auth, isStudent, verifyPayment);

router.post("/sendPaymentSuccessEmail",auth, isStudent, sendPaymentSuccessEmail);


//exporting the router
module.exports = router;