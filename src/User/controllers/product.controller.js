const mongoose = require("mongoose");
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

  // Get product for user
  getProductForUser: asyncHandler(async (req, res) => {
    const { id } = req.params; // for single product detail

    if (id) {
      const product = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        // Lookup to populate userId field from User collection
        {
          $lookup: {
            from: "users", // collection to join with
            localField: "userId", // field from the Product collection
            foreignField: "_id", // field from the User collection
            as: "userDetails", // output array field
          },
        },

        // Unwind the userDetails array to deconstruct the array into individual documents
        { $unwind: "$userDetails" },

        // Project to include/exclude specific fields
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            "userDetails.otp": 0,
            "userDetails.mobileNumber": 0,
            "userDetails.createdAt": 0,
            "userDetails.updatedAt": 0,
            "userDetails.wishList": 0,
            "userDetails.address": 0,
            "userDetails.isRegisterd": 0,
          },
        },
      ]);

      // Since aggregate returns an array, you may need to get the first element
      const productDetail = product.length > 0 ? product[0] : null;
      if (!productDetail) {
        return res.status(400).json(new ApiError(400, "Data not found"));
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            productDetail,
            "Product detail found successfully"
          )
        );
    }

    const products = await Product.aggregate([
      // Lookup to populate userId field from User collection
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      // Unwind the userDetails array to deconstruct the array into individual documents
      { $unwind: "$userDetails" },

      // Project to include/exclude specific fields
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          "userDetails.otp": 0,
          "userDetails.mobileNumber": 0,
          "userDetails.createdAt": 0,
          "userDetails.updatedAt": 0,
          "userDetails.wishList": 0,
          "userDetails.address": 0,
          "userDetails.isRegisterd": 0,
        },
      },
    ]);

    if (!products) {
      return res.status(400).json(new ApiError(400, "Data not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, products, "Products detail found successfully")
      );
  }),

  // Get product for Owner
  getProductForOwner: asyncHandler(async (req, res) => {
    const { id } = req.params; // for single product detail
    const userId = req.user._id;

    if (id) {
      const product = await Product.findById(id)
        .select("-createdAt -updatedAt")
        .populate({
          path: "userId",
          select:
            "-otp -mobileNumber -createdAt -updatedAt -wishList -address -isRegisterd",
        });
      if (!product) {
        return res.status(400).json(new ApiError(400, "Data not found"));
      }
      return res
        .status(200)
        .json(
          new ApiResponse(200, product, "Product detail found successfully")
        );
    }

    const products = await Product.find({ userId })
      .select("-createdAt -updatedAt")
      .populate({
        path: "userId",
        select:
          "-otp -mobileNumber -createdAt -updatedAt -wishList -address -isRegisterd",
      });

    if (!products) {
      return res.status(400).json(new ApiError(400, "Data not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, products, "Products detail found successfully")
      );
  }),
};

module.exports = productController;
