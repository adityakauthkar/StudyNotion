const nodemailer = require("nodemailer");

const mailSender = async(email, title, body) => {
    try {
        console.log("here we are going to send the mail ", process.env.MAIL_HOST, process.env.MAIL_USER, process.env.MAIL_PASS);
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            // port: 587,
            // secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        

        let info = await transporter.sendMail({
            from: "StudyNotion || Codehelp - by Akash Khalekar",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("info", info);
        return info;
    } catch (error) {
        console.log("error occured while sending mail", error);

    }
};

module.exports = mailSender