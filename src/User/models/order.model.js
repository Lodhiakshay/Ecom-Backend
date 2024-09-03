const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId },
    productId: { type: String },
    deliveredBy: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        "Shipping",
        "Shipped",
        "At Jaipur",
        "Out of delivery",
        "Delivered",
      ],
      default: "Shipping",
    },
  },
  { timestamps: true }
);

const order = mongoose.model("Order", orderSchema);

module.exports = order;
