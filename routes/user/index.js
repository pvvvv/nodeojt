var express = require('express');
var passport = require('passport');
var router = express.Router();
var userController = require('./user-controller');

/* 사번 중복확인 */
router.post('/findoverlap', userController.findoverlap);
/* 회원가입 */
router.post('/join', userController.doJoin);
/* 로그인 + Passport */
router.post('/login', passport.authenticate('local',{
    failureRedirect : '/',
}), userController.doLogin
);
/* 로그아웃 */
router.get('/logout', userController.logout);






module.exports = router;