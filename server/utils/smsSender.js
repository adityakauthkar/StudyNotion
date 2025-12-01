// require("dotenv").config()

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN;




// //send the message
// const sendSMS = async(message, number) => {

//     //create the client
//     const client = require('twilio')(accountSid, authToken);
//     const phone = "+"+91+number;
//     console.log("phone",number)
//     console.log("number", phone);
//     let messageOption = {
//         to: phone,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         body: message
    
//     }

//     try {
//         const msg = await client.messages.create(messageOption)
//         console.log("msg",msg);
//     } catch (error) {
//         console.log(error)
//     }
// }

// module.exports = sendSMS;

// // sendSMS("Hello, this is a test message")