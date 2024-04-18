const express = require('express');
const { createStore,getStores } = require("../controller/storeController");
const router = express.Router();
const tokenCheck = require("../middleware/tokenCheck")

router.post('/',tokenCheck(),createStore)
router.get('/',tokenCheck(),getStores)

module.exports = router;