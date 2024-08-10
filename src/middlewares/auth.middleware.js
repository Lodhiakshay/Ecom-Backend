const User = require("../User/models/user.model");
const jwt = require("jsonwebtoken");

exports.userAuthAuthenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please Login",
      });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("**** Verified ****", verified)

    req.user = verified;

    const user = await User.findById(verified._id);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid user",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};
