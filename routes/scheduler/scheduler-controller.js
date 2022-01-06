var db = require("../../models");
var sequelize = require('sequelize');

exports.iframeSchedulerPage = async function(req, res, next){
    var schedulerData = await db.scheduler.findAll({});
    data = schedulerData;

    try{  
        res.render('iframe-scheduler.html', data);
    } catch (error) {
        next(error);
    };
};

/* 스케줄러 페이지로 이동 + 데이터 가지고가서 뿌리기 */
exports.schedulerPage = async function(req, res, next){
    var schedulerData = await db.scheduler.findAll({});
    data = schedulerData;

    for(i=0; i < data.length ; i++){
        var titleMix = "["+data[i].location+"]"+"["+data[i].name+"]"+"["+data[i].title+"]";
        data[i].title = titleMix;
    }

    try{  
        res.render('scheduler.html', data);
    } catch (error) {
        next(error);
    };
};
 
/* 스케줄러 인서트 페이지로 이동 */
exports.scheduleInsertPage = async function(req, res, next){
    res.render('insert-scheduler.html');
};

/* 특정 자원, 날짜 조회하여 예약된데이터 반환 */
exports.findDate = async function(req, res, next){
    var OP = sequelize.Op;
    var {startDate, roomName} = req.body;
    var minTime = startDate+"T00:00:00";
    var maxTime = startDate+"T23:59:59";
    var statusNum;

    try {
        var findData = await db.scheduler.findOne({
            where : {
                startDate : {
                    [OP.gte] : minTime,
                    [OP.lte] : maxTime
                },
                location : {
                    [OP.like] : '%' + roomName + '%'
                }
            }
        });
        if(findData == null){
            return statusNum = 200;
        }else{
            statusNum = 200;
        }
        res.status(statusNum).json(findData);
    } catch (error) {
        next(error);
    }
};

exports.scheduleInsert = async function(req, res, next){
    var {name, location, title, startDate, startTime, endDate, endTime, allday} = req.body;
    var id = req.session.user.ID;
    var category;
    var start = startDate+"T"+startTime;
    var end = endDate+"T"+endTime;

    console.log(location);
    
    try {
        if(allday === "true"){
            category = "allday";
            start = startDate+"T08:00:00"; 
            end = startDate+"T19:00:00";
        }else{
            category = "time";
        };

        try { // 한번 더 묶어주지 않으면 에러페이지로 이동
            var success = await db.scheduler.create({
                id: id,
                name : name,
                title: title,
                location: location,
                category: category,
                startDate: start,
                endDate: end
            });
        } catch (error) {
            next(error);
        }
        res.redirect('/scheduler');
    }catch (error) {
        next(error);
    }

};




 
exports.scheduleModify = async function(req, res, next){}
exports.scheduleDelete = async function(req, res, next){}