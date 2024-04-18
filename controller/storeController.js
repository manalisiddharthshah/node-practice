const Store = require('../model/Store')
const mongoose = require('mongoose')

exports.createStore = async (req,res) =>{
    try {
        req.body.userId = req.user.id
        const product = await Store.create(req.body)
        return res.json({
            success: true,
            data: product,
            message: "Product Created Successfully !",
          });
    } catch (error) {
    return res.json({ success: false, message: error.message });
    }
}


exports.getStores = async (req,res) =>{
    try {
        const product = await Store.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as: "userObj",
                }
            },
            {
                $unwind: "$userObj"
            },
            {
                $project:{
                    username:{ $concat: [ "$userObj.firstName", " ", "$userObj.lastName" ] },
                    name:1,
                    city:1,
                    userId:1
                } 
            },
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(req.user.id)
                }
            }
        ])
        return res.json({
            success: true,
            data: product,
            message: "Product details display Successfully !",
          });
    } catch (error) {
    return res.json({ success: false, message: error.message });
    }
}