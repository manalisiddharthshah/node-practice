const mongoose = require("mongoose")

const store = new mongoose.Schema(
    {
      name:{
        type:String,
        default:"",
      },
      city:{
        type:String,
        default:"",
      },
      price: {
        type: Number,
        default: 0,
      },
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      }
    },
    { timestamps: true }
  );
  module.exports = mongoose.model("Store", store);