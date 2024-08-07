const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
productName: {type:String},
  category: {type:String},
  images: [{type:String}],
  userId: {type: mongoose.Types.ObjectId},
  price: {type:Number},
  detaile: {type:String},
  rating: {type:Number},
  isAvailable: {type:Boolean}
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

module.exports = Product 