var db = require("../../models");


exports.schedulerPage = async function(req, res, next){
    try{   
        res.render('scheduler.html');
    } catch (error) {
        next(error);
    };
};

