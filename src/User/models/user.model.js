const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const addresSchema = {
  pincode: Number,
  locality: String,
  address: String,
  city: String,
  state: String,
  landMark: String,
  addressType: {
    type: String,
    enum: ["Home", "Work"],
    default: "Home",
  },
};

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: {
      type: String,
    },
    altMobileNumber: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    otp: {
      type: Number,
      default: 1234,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    address: addresSchema,
    wishList: {
      type: Boolean,
      default: false,
    },
    isRegisterd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hast the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify if the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bycrypt.compare(password, this.password);
};

// Generate tocken
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
