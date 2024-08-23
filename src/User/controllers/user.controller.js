const User = require("../models/user.model");
const asyncHandler = require("../../utils/asyncHandeler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const { sendOtpByEmail, generateOTP } = require("../../utils/sendEmail");
const uploadToCloudinary = require("../../utils/cloudinary");

const userController = {
  // Register new User
  register: asyncHandler(async (req, res) => {
    // Required fields
    const { firstName, lastName, email, password } = req.body;

    // is user Exist
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res
        .status(400)
        .json(new ApiError(400, "Email allready exists, please login"));
    }

    const otp = generateOTP();

    // Register User
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      otp,
    });

    sendOtpByEmail(email, otp);

    if (!newUser) {
      return res
        .status(400)
        .json(new ApiError(400, "Got an error while register"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, newUser, `OTP send to your email ${email}`));
  }),

  // Verify Otp
  verifyOtp: asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const existEmail = await User.findOne({ email });

    if (!existEmail) {
      return res.status(400).json(new ApiError(400, "Email not exists"));
    }

    if (existEmail.otp === otp) {
      // Invalidate the otp after successfull verification
      existEmail.otp = null;
      existEmail.isRegisterd = true;
      await existEmail.save();

      res
        .status(200)
        .json(new ApiResponse(200, existEmail, "Otp verified successfully"));
    } else {
      return res.status(400).json(new ApiError(400, "Invalid Otp"));
    }
  }),

  // Resend Otp
  reSendOtp: asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(400).json(new ApiError(400, "Email not exists"));
    }

    const otp = generateOTP();

    existUser.otp = otp;
    await existUser.save();

    sendOtpByEmail(email, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, existUser, "Otp resent successfully"));
  }),

  // Login User
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // check exist User with given email
    const existUser = await User.findOne({
      email,
    }).select("+password");

    if (!existUser) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Email, Please register first"));
    } else if (!existUser.isRegisterd) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Please verify your OTP and complete your signup")
        );
    }

    const isPasswordValid = existUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiError(400, "Please enter correct password"));
    }

    const token = existUser.generateToken();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...existUser.toObject(), token },
          "Logged in successfully"
        )
      );
  }),

  // Update profile
  updateProfile: asyncHandler(async (req, res) => {
    const id = req.user._id;

    // console.log("id", id);

    //  data for update
    const {
      firstName,
      lastName,
      age,
      gender,
      address,
      mobileNumber,
      email,
      altMobileNumber,
    } = req.body;

    // Email mobile should be unique
    if (email || mobileNumber) {
      const query = [];

      if (email) {
        query.push({ email });
      }
      if (mobileNumber) {
        query.push({ mobileNumber });
      }

      if (query.length > 0) {
        const existUser = await User.findOne({
          _id: { $ne: id },
          $or: query,
        });
        if (existUser) {
          const conflictField =
            existUser.email === email ? "email" : "mobileNumber";

          return res
            .status(400)
            .json(
              new ApiError(
                400,
                `User already exists with this ${conflictField}`
              )
            );
        }
      }
    }

    let profileImage;

    // console.log("req.file", req.file)

    if (req.file) {
      profileImage = await uploadToCloudinary(req.file?.path);
    }

    // console.log("path", profileImage)
    const payload = {
      firstName,
      lastName,
      age,
      gender,
      address,
      mobileNumber,
      altMobileNumber,
      profileImage,
      email,
    };

    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });

    // console.log("User", updatedUser)

    if (!updatedUser) {
      return res.status(400).json(new ApiError(400, "Profile not updated"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  }),
};
module.exports = userController;
