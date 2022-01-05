var passport = require('passport'); // passport require
var LoaclStrategy = require('passport-local').Strategy; // passport-local.Strategy require
var db = require("../models"); // DB
var bcrypt = require('bcrypt');

module.exports = function(res ,req){
    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(async function(user, done){
        try {    
            if(user === undefined || user === null){
                return done(null, false);
            }else{
                return done(null, user);
            }// 세션
        } catch (error) {
            
        };
    });

    passport.use(new LoaclStrategy({
        usernameField : 'id',
        passwordField : 'password',
        session : true,
        passReqToCallback : true,
    }, async function(req, id, password, done){
        try {
            var findData = await db.user.findOne({
                where : {
                    ID : id
                }
            });
            
            if(findData === null){
                return done(null, false, {message : '존재하지 않는 아이디입니다.'});
            }else if(!bcrypt.compareSync(password, findData.password)){
                return done(null, false, {message : '비밀번호가 틀렸습니다'});
            }else{
                req.session.user = findData;
                done(null, findData);
            }
        } catch (error) {
            throw error;
        };  
    }
    ));
};// export