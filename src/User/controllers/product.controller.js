const Product = require("../models/product.model");
const asyncHandler = require("../../utils/asyncHandeler");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const uploadToCloudinary = require("../../utils/cloudinary");

const productController = {
  // Add product
  createProduct: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productName, category, price, detaile } = req.body;

    let productImages = [];

    if (req.files && req.files.length > 0) {
      console.log("Uploaded Files:", req.files);
  
      // Loop through each file and upload to Cloudinary
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.path, "Product-Images");
        productImages.push(imageUrl);
      }
    }

    const product = await Product.create({
      productName,
      productImages,
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

  // Delete a product
  deleteProduct: asyncHandler(async (req, res) => {
    // Product for for deletion
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(new ApiError(400, "Product id is required for deletion"));
    }

    // Find by id and delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(400)
        .json(new ApiError(400, "Product not found with this id"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedProduct, "Product delete successfully")
      );
  }),
};

module.exports = productController;
