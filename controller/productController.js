const Product = require("../model/Product");
const mongoose = require("mongoose");
const mail = require("../services/sendEmail");
const path = require('path');
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    req.body.image = req.file.filename;
    const product = await Product.create(req.body);
    const html = `
    you have created product <br>
    product name : ${req.body.name} <br>
    price : ${req.body.price}
    `;
    await mail(req.user.email, "Product created", html);
    
    return res.json({
      success: true,
      data: product,
      message: "Product Created Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const options = {
        page: 1,  
        limit: 3,
    };
    const minPrice = Number(req.query.minPrice)
    const maxPrice = Number(req.query.maxPrice)
    const regex = new RegExp(req.query.search,'i')
    
    const sortDirection =
    req.query.sortDirection == undefined || req.query.sortDirection == ""
        ? -1
        : Number(req.query.sortDirection);
    const sortyBy =
    req.query.sortyBy == undefined || req.query.sortyBy == ""
        ? "createdAt"
        : req.query.sortyBy;
    const aggregate = await Product.aggregate([
    // {
    //     $lookup: {
    //     from: "users",
    //     localField: "userId",
    //     foreignField: "_id",
    //     as: "userObj",
    //     },
    // },
    // { $unwind: "$userObj" },
    // {
    //     $lookup: {
    //     from: "stores",
    //     localField: "storeId",
    //     foreignField: "_id",
    //     as: "storeObj",
    //     },
    // },
    // { $unwind: "$storeObj" },
    {
        $project: {
        name: 1,
        price: 1,
        userId: 1,
        createdAt:1,
        image: {
          $cond: {
            if: { $eq: ["$image", ""] },
            then: "",
            else: {
              $concat: [process.env.IMG_URL, "$image"],
            },
          },
        },
        // username: "$userObj.username",
        // storename:"$storeObj.name"
        },
    },
    {
      $match: { 
        $and: [
          {userId: new mongoose.Types.ObjectId(req.user.id)},
          {
            $or: [{ name: regex }],
          },
          { price: { $gte: minPrice } }, { price: { $lte: maxPrice } }
        ],
      },
    },
    {
        $sort: {  [sortyBy]: sortDirection },
    },
    ]);
//  const result =  await Product.aggregatePaginate(aggregate, options)
  
    return res.json({
      success: true,
      data: aggregate,
      message: "All Product Retrived Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    // const product = await Product.findOne({_id:req.params.id})
    const product = await Product.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userObj",
        },
      },
      { $unwind: "$userObj" },
      {
        $project: {
          name: 1,
          price: 1,
          userId: 1,
          image: {
            $cond: {
              if: { $eq: ["$image", ""] },
              then: "",
              else: {
                $concat: [process.env.IMG_URL, "$image"],
              },
            },
          },
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
    ]);
    return res.json({
      success: true,
      data: product[0],
      message: "Product Retrived Successfully !",
    }); 
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    req.body.image = req.file.filename;
    const productData = await Product.findById(req.body.id);
    const imagePath = path.join(__dirname, '../uploads/', productData.image);
    fs.unlinkSync(imagePath); 
    const product = await Product.updateOne(
      { _id: req.body.id },
      { $set: req.body }
    );
    return res.json({
      success: true,
      message: "Product Updated Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productData = await Product.findById(req.params.id);

    const imagePath = path.join(__dirname, '../uploads/', productData.image);
    fs.unlinkSync(imagePath); 
    const product = await Product.deleteOne({ _id: req.params.id });
    return res.json({
      success: true,
      message: "Product Deleted Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};