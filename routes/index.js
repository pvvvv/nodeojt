var express = require('express');
var router = express.Router();
var userController = require('../routes/user/user-controller');
var scheduleController = require('../routes/scheduler/scheduler-controller');

/* 로그인 페이지로 이동 */
router.get('/', userController.loginPage);
/* 회원가입 페이지로 이동 */
router.get('/join', userController.joinPage);


module.exports = router;
