const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandeler");
const Product = require("../models/product.model");

const reviewController = {
  postReview: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { text, rating } = req.body;

    if (rating > 5 || rating < 0) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Rating should be grater than 0 and less than")
        );
    }

    // find the product by Id
    const product = await Product.findById(productId).select("review");

    // if not product with given id
    if (!product) {
      return res.status(400).json(new ApiError(400, "Product not found"));
    }

    // check if the user has already review this product

    const existingReview = product.review.find(
      (rev) => rev.userId.toString() === userId.toString()
    );

    if (existingReview) {
      return res
        .status(400)
        .json(new ApiError(400, "You already reviewed this product"));
    }

    // Add the review  to the product's review array
    product.review.push({ userId, text, rating });

    // save the updated product
    product.save();

    // const payload = {
    //   review,
    // };

    // const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
    //   new: true,
    // });

    if (!product) {
      return res.status(400).json(new ApiError(400, "Product not updated"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  }),

  getReview: asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .select("review")
      .populate({
        path: "review.userId",
        select: "firstName lastName profileImage",
      });

    if (!product) {
      return res.status(400).json(new ApiError(400, "Product not Found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, product, "Review found successfully"));
  }),
};

module.exports = reviewController;
