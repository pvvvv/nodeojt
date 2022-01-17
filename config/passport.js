var passport = require('passport'); // passport require
var LoaclStrategy = require('passport-local').Strategy; // passport-local.Strategy require
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt; 
var opts = {}
var db = require("../models"); // DB
const jwtKey = require('../config/jwt-index');
var bcrypt = require('bcrypt');


module.exports = function(res ,req){
    passport.serializeUser(function(user, done){
        console.log("dnllllll")
        done(null, user);
    });

    passport.deserializeUser(async function(user, done){
        console.log("1번입니다");
        try {    
            if(user === undefined || user === null){
                return done(null, false);
            }else{
                return done(null, user);
            }// 세션
        } catch (error) {
            
        };
    });
    
    // passport.use(new LoaclStrategy({
    //     usernameField : 'id',
    //     passwordField : 'password',
    //     session : true,
    //     passReqToCallback : true,
    // }, async function(req, id, password, done){
    //         try {
    //             var findData = await db.user.findOne({
    //                 where : {
    //                     ID : id
    //                 }
    //             });
                
    //             if(findData === null){
    //                 console.log("실패실패!!!");
    //                 return done(null, false, {message : '존재하지 않는 아이디입니다.'});
    //             }else if(!bcrypt.compareSync(password, findData.password)){
    //                 console.log("실패실패!!!2222222222");
    //                 return done(null, false, {message : '비밀번호가 틀렸습니다'});
    //             }else{
    //                 //req.session.user = findData;
    //                 console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!")
    //                 done(null, findData);
    //             }
    //         } catch (error) {
    //             throw error;
    //         };  
    //     }
    // ));
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtKey.jwtKey.SECRET
    },(paylode, next)=>{
        console.log("여긴왔니!!!!!!!!!");
        db.user.findOne({
            where:{
                id: paylode.id,
            }
        }).then(async (user)=>{
            if(!user){
                next(null, false);
            }else{
                console.log("@@@@@@@@@@@@@@@@@@@@여기!!!@@@@@@@@@@@@@2")
                next(null, user);
            }
        }).catch((err) =>{
            console.log(err);
            console.log("######################여기");
            next(null, false);
        });
    }
    ));


    // new JwtStrategy(options, verify)

    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // opts.secretOrKey = jwt.jwtKey.SECRET;

    // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //     db.user.findOne({id: jwt_payload.sub}, function(err, user) {
    //         console.log("*****************"+jwt_payload.sub);
    //         if (err) {
    //             return done(err, false);
    //         }
    //         if (user) {
    //             return done(null, user);
    //         } else {
    //             return done(null, false);
    //             // or you could create a new account
    //         }
    //     });
    // }));
    


    // passport.use(new JwtStrategy({
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //     secretOrKey: jwt.jwtKey.SECRET,
    // },function(payload, done){
    //         console.log("*****************"+payload);
    // }
    // ));

    // var jwtOptions = {
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //     secretOrKey: jwt.jwtKey.SECRET,
    // };

    // //JWT Strategy
    // passport.use(new JWTStrategy({
    //     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //     secretOrKey   : process.env.JWT_SECRET
    // },function (jwtPayload, done) {
    //     return UserModel.findOneById(jwtPayload.id)
    //         .then(user => {
    //             return done(null, user);
    //         })
    //         .catch(err => {
    //             return done(err);
    //         });
    // }
    // ));



};// export