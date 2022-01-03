var express = require('express');
var router = express.Router();
var userController = require('../routes/user/user-controller');

/* GET Login page. */
router.get('/', userController.loginPage);
/* GET Join page. */
router.get('/join', userController.joinPage);

module.exports = router;
