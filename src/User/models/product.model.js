const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String },
    category: { type: String },
    productImages: [{ type: String, trim: true }],
    userId: { type: mongoose.Types.ObjectId, ref: "User" }, // For owner of product
    price: { type: Number },
    detaile: { type: String },
    rating: { type: Number },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
