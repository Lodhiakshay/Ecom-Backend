const nodemailer = require("nodemailer")

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000)
}


const sendOtpByEmail = async(email, otp) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

    })

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Project OTP",
        html: `<h1>Your Ecom Otp: ${otp}</h1>`
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent: ", info.response)

    } catch (error) {
        console.log("Error ssending email: ", error)
    }
}


module.exports = { sendOtpByEmail, generateOTP }