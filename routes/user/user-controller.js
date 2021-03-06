var db = require("../../models");
var bcrypt = require('bcrypt');

/* 로그인(메인) 페이지 */
exports.loginPage = async function(req, res, next){
    try{   
        res.render('login.html');
    } catch (error) {
        next(error);
    };
};

/* 회원가입 페이지 */
exports.joinPage = async function(req, res, next){
    try{   
        res.render('join.html');
    } catch (error) {
        next(error);
    };
};

/* 중복확인 */
exports.findoverlap = async function(req, res, next){
    var statusNum;
    var success = {};
    var id = req.body.id;
    
    try{ 
        var findData = await db.user.findOne({
            where: {id: id}
        });

        if(findData === null){
            success.text = "사용이 가능한 사번입니다.";
            success.overlapCheck = 1;
            statusNum = 200;
        }else{
            success.errorMessage = "사용중인 아이디입니다.";
            success.overlapCheck = 0;
            statusNum = 409
        };
        res.status(statusNum).json(success);
    } catch (error) {
        next(error);
    };
}

/* 회원가입 */
exports.doJoin = async function(req, res, next){
    var success = {};
    var statusNum;
    var {id,name, password} = req.body;
    console.log(id, name, password);
    var regId = /^[0-9]{4}$/;
    var regPw = /^[A-Za-z0-9+]{4,8}$/;

    try{
        var findData = await db.user.findOne({
            where: {id: id}
        });
        
        if(findData !== null){
            statusNum = 409;
            success.errorMessage = "이미 가입된 계정입니다";
        }else if(!regId.test(id) || !regPw.test(password)){
            success.errorMessage = "잘못된 접근입니다.";
            statusNum = 400;
        }else{
            var saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            var encryptedPassword = bcrypt.hashSync(password, salt);

            try {
                db.user.create({
                    id : id,
                    name : name,
                    password: encryptedPassword
                });
                success.text = "가입되셨습니다!"
                statusNum = 200;
            } catch (error) {
                statusNum = 400;
                success.errorMessage = "가입에 실패했습니다. 고객센터로 전화주세요";
            }
        };
        res.status(statusNum).json(success);
    } catch (error) {
        next(error);
    };
}

exports.doLogin = async function(req, res, next){
    try {        
        res.redirect('/scheduler/');
    } catch (error) {
        next(error);
    }
}

exports.logout = async function(req, res, next){
    try{
        req.session.destroy(function(){ 
            req.session;
        });
        res.redirect('/');
    } catch (error) {
        next(error);
    };
}