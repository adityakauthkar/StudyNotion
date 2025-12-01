const express = require("express");
const app = express();
const mongoose = require("mongoose")


const userRouter = require("./routes/User");
// const courseRouter = require("./routes/Course");
const courseRouter = require("./routes/Course");
const paymentRouter = require("./routes/Payment");
const profileRouter = require("./routes/Profile");
const contactUsRouter= require("./routes/ContactUs")


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinaryConnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();


const PORT = process.env.PORT || 5000;

//database connect
database.connect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.options('*', cors()); 
// app.use(
//     cors({
//             origin: '*', 
//             methods: ['*'], 
//             allowedHeaders: ['Content-Type', 'Authorization'],
//             credentials: true
//     })
// );

app.use(cors());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

//cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/contact", contactUsRouter);

// Enable Mongoose debugging
// mongoose.set('debug', true);

//default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    })
})

//server listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})