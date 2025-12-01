const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        requied: true,
    },
    otp: {
        type: String,
        requied: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,//5 min ke baad expire ho jaega
    }
}, {timestamps: true});

async function sendVerificationEmail(email, otp){
    try {
            const mailResponse = await mailSender(email, 
                "Verification Email from StudyNotion", 
                emailTemplate(otp));
            
            console.log("Email sent successfully ", mailResponse);

    } catch (error) {
        console.log("error occured while sending verification mail: ", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    // Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})

module.exports = new mongoose.model("Otp", otpSchema);