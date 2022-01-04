var db = require("../../models");

exports.loginPage = async function(req, res, next){
    try{   
        res.render('login.html');
    } catch (error) {
        next(error);
    };
};

exports.joinPage = async function(req, res, next){
    try{   
        res.render('join.html');
    } catch (error) {
        next(error);
    };
};