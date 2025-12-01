import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { ERROR } from "video-react/lib/actions/video";
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
//import dotenv from 'dotenv'



const { studentEndPoints } = require("../apis");


const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndPoints


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch){
    const toastId = toast.loading("Loading...")
    try {
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("Razorpay SDK failed to load");
            return;
        }

        //initiate the order
        console.log("COURSES", courses);
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                            {courses}, 
                                            {
                                                authorisation: `Bearer ${token}`,
                                            }
        )
        console.log("ORDER RESPONSE", orderResponse);
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        //creating the options
        console.log("key", process.env.REACT_APP_RAZORPAY_KEY)
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response){
                //send successfull wala mail
                sendPaymentSuccessfulEmail(response, orderResponse.data.data.amount, token)
                //verify payment
                verifyPayment({...response, courses}, token, dispatch, navigate);
                
            }

        }
        console.log("options", options);
        //create window
        const paymentObject = new window.Razorpay(options);
        //open that window
        paymentObject.open();
        paymentObject.on("payment.failed", function(response){
            toast.error("oops payment failed");
            console.log(response.error);
        })
        // console.log("OPTIONS", options);
    } catch (error) {
        console.log("PAYMENT API ERROR", error);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);
}


async function sendPaymentSuccessfulEmail(response, amount, token){
    try {
        console.log("inside email send")
       const res= await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, 
                            {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                amount
                            },
                            {
                                "Content-Type": "multipart/form-data",
                                 authorisation: `Bearer ${token}`,
                            }

        )

        console.log("response", res)
    } catch (error) {
        console.log("SEND PAYMENT SUCCESS EMAIL API ERROR", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, dispatch, navigate){
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try {
        console.log("before res", bodyData);
        const courses = bodyData.courses[0]
        // const courses = bodyData;
        const razorpay_order_id = bodyData.razorpay_order_id;
        const razorpay_payment_id = bodyData.razorpay_payment_id;
        const razorpay_signature = bodyData.razorpay_signature;
        console.log("bodyData", bodyData.courses[0], "token", token, "dispatch", dispatch, "navigate", navigate);
         const response = await apiConnector("POST", COURSE_VERIFY_API, 
        //  {
        //     // courses,
        //     // razorpay_order_id,
        //     // razorpay_payment_id,
        //     // razorpay_signature

        //  }, 
        bodyData,
         {
            "Content-Type": "multipart/form-data",
            authorisation: `Bearer ${token}`,
         })
         console.log("res", response);
         if(!response.data.success){
             throw new Error(response.data.message);
         }

        toast.success("Payment Successful , You can now access the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart())
    } catch (error) {
        console.log("VERIFY PAYMENT API ERROR", error);
        toast.error("Could not verify payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}