require("dotenv").config();
const express = require("express");
const app = express();
require("./config/connection");
const path = require('path')
const mongoose = require("mongoose");
mongoose.set("debug", true);

const cors = require("cors");

app.use(cors());

app.use(express.json({ limit: "150mb" }));
app.use(express.static(path.join(__dirname, 'uploads')))

const userRouter = require('./routes/userRoutes')
const storeRouter = require('./routes/storeRoutes')
const productRouter = require('./routes/productRoutes')

app.use('/user',userRouter)
app.use('/store',storeRouter)
app.use('/product',productRouter)

app.use((req,res,next) => {
    res.send("hello")
})

app.listen(process.env.PORT, () => {
    console.log("app is running on ", process.env.PORT);
  });