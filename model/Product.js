const mongoose = require("mongoose")
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const product = new mongoose.Schema(
    {
      name: {
        type: String,
        default: "",
      },
      price: {
        type: Number,
        default: 0,
      },
      image:{
        type: String,
        default: "",
      },
      description:{
        type:String,
        default:"",
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      storeId :{
        type :mongoose.Schema.Types.ObjectId,
        ref:'Store'
      }
    },
    { timestamps: true }
  );
  product.plugin(aggregatePaginate);

  module.exports = mongoose.model("Product", product);