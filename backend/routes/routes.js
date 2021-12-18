const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost:27017/labeca')

const routerAdmin = require('./router.admin');

router.use('/admin', routerAdmin);


module.exports = router;
