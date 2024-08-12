const router = require("express").Router();
const productController= require("../controllers/product.controller");
const { userAuthAuthenticated } = require("../../middlewares/auth.middleware")
const upload = require("../../middlewares/multer.middleware");


// Product controller
router.post("/createProduct", userAuthAuthenticated, upload.array("productImages", 5), productController.createProduct)
router.delete("/deleteProduct/:id", userAuthAuthenticated, productController.deleteProduct)


module.exports = router