const router = require("express").Router();
const userController = require("../controllers/user.controller");
const upload = require("../../middlewares/multer.middleware");
const { userAuthAuthenticated } = require("../../middlewares/auth.middleware");

router.post("/register", userController.register);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/resentOtp", userController.reSendOtp);
router.post("/login", userController.login);

// sequire routes
router.patch(
  "/updateProfile",
  userAuthAuthenticated,
  upload.single("profileImage"),
  userController.updateProfile
);

module.exports = router;
