const User = require("../models/user.model")
const asyncHandler = require("../../utils/asyncHandeler")
const ApiError = require("../../utils/ApiError")
const ApiResponse = require("../../utils/ApiResponse")
const { sendOtpByEmail, generateOTP } = require("../../utils/sendEmail")


const userController = {

    // Register new User
    register: asyncHandler(async(req, res) => {

        // Required fields
        const { firstName, lastName, email, password } = req.body

        // is user Exist
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json(new ApiError(400, "Email allready exists, please login"))
        }

        const otp = generateOTP()

        // Register User
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            otp
        })

        sendOtpByEmail(email, otp)

        if (!newUser) {
            return res.status(400).json(new ApiError(400, "Got an error while register"))
        }

        return res.status(201).json(new ApiResponse(200, newUser, `OTP send to your email ${email}`))
    }),

}
module.exports = userController