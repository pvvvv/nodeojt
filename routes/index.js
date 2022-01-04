var express = require('express');
var router = express.Router();
var userController = require('../routes/user/user-controller');
var scheduleController = require('../routes/scheduler/scheduler-controller');

/* GET Login page. */
router.get('/', userController.loginPage);
/* GET Join page. */
router.get('/join', userController.joinPage);
/* GET schedule page. */
router.get('/scheduler', scheduleController.schedulerPage);

module.exports = router;
