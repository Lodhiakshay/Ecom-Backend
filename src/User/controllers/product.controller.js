const Product = require("../models/product.model");
const asyncHandler = require("../../utils/asyncHandeler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const productController = {
  createImage: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productName, category, price, detaile } = req.body;

    const product = await Product.create({
      productName,
      category,
      userId,
      price,
      detaile,
    });

    if (!product) {
      return res.status(400).json(new ApiError(400, "Product not created"));
    }
    return res
      .status(201)
      .json(new ApiResponse(200, product, "Product created successfully"));
  }),
};

module.exports = productController;
