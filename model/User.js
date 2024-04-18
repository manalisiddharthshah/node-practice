const mongoose = require("mongoose")

const user = new mongoose.Schema(
    {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      username:{
        type:String,
        default:"",
      },
      email: {
        type: String,
        default: "",
        unique:true,
      },
      password: {
        type: String,
        default: "",
      },
      age: {
        type: Number,
        default: 0,
      },
      gender:{
        type:String,
        default:""
      }
    },
    { timestamps: true }
  );
  module.exports = mongoose.model("User", user);