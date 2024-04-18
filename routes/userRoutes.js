const express = require('express');
const {signup,signin} = require("../controller/userController");
const router = express.Router();
const Validation  = require("../middleware/validation");

router.post('/signup',Validation(["email","password"]),signup)
router.post('/signin',Validation(["email","password"]),signin)

module.exports = router;