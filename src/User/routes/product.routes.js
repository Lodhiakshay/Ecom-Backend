const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { userAuthAuthenticated } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/multer.middleware");
const reviewController = require("../controllers/review.controller");

// Product controller
router.post(
  "/createProduct",
  userAuthAuthenticated,
  upload.array("productImages", 5),
  productController.createProduct
);
router.get("/product/:id?", productController.getProductForUser);
router.get(
  "/productForOwner/:id?",
  userAuthAuthenticated,
  productController.getProductForOwner
);

router.delete(
  "/deleteProduct/:id",
  userAuthAuthenticated,
  productController.deleteProduct
);

// Review Routes
router.post(
  "/review/:productId",
  userAuthAuthenticated,
  reviewController.postReview
);

router.get(
  "/review/:productId",
  userAuthAuthenticated,
  reviewController.getReview
);

module.exports = router;
