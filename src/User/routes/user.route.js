const router = require("express").Router()
const userController = require("../controllers/user.controller")



router.post("/register", userController.register)
router.post("/verifyOtp", userController.verifyOtp)
router.post("/resentOtp", userController.reSendOtp)
router.post("/login", userController.login)

module.exports = router