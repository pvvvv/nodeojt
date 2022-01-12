var express = require('express');
var passport = require('passport');
var router = express.Router();
var userController = require('./user-controller');

router.post('/findoverlap', userController.findoverlap);
router.post('/join', userController.doJoin);
router.post('/login', passport.authenticate('local',{
    failureRedirect : '/',
}), userController.doLogin
);

router.get('/logout', userController.logout);






module.exports = router;