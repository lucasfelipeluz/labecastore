const express = require('express');

const router = express.Router();

const routerAdmin = require('./router.admin');

router.use('/admin', routerAdmin);


module.exports = router;
