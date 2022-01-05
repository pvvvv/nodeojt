var db = require("../../models");


exports.iframeSchedulerPage = async function(req, res, next){
    var schedulerData = await db.scheduler.findAll({});
    data = schedulerData;

    try{  
        res.render('iframe-scheduler.html', data);
    } catch (error) {
        next(error);
    };
};

exports.schedulerPage = async function(req, res, next){
    var schedulerData = await db.scheduler.findAll({});
    data = schedulerData;

    try{  
        res.render('scheduler.html', data);
    } catch (error) {
        next(error);
    };
};
 
exports.scheduleInsertPage = async function(req, res, next){
    res.render('insert-scheduler.html');
};

exports.scheduleInsert = async function(req, res, next){
    var {name, location, title, startDate, startTime, endDate, endTime, allday} = req.body;
    var id = req.session.user.ID;
    var category;
    var titleMix = "["+location+"]"+"["+name+"]"+"["+title+"]";
    var start = startDate+"T"+startTime;
    var end = endDate+"T"+endTime;

    try {
        if(allday === "true"){
            category = "allday";
            start = startDate+"T08:00:00"; 
            end = startDate+"T19:00:00";
        }else{
            category = "time";
        };


        db.scheduler.create({
            id: id,
            title: titleMix,
            category: category,
            startDate: start,
            endDate: end
        });
        res.redirect('/scheduler');
    }catch (error) {
        next(error);
    }

};
 
exports.scheduleModify = async function(req, res, next){}
exports.scheduleDelete = async function(req, res, next){}