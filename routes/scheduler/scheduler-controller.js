var db = require("../../models");


exports.schedulerPage = async function(req, res, next){
    //var {start} = req.body; 데이터 다 꺼내오기
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
        if(allday == true){
            category = "allday";
            // start = ; 
            // end = ;
        }else{
            category = "time";
        };

        db.scheduler.create({
            ID: id,
            TITLE: titleMix,
            CATEGORY: category,
            START: start,
            END: end
        });
        res.redirect('/scheduler');
    }catch (error) {
        next(error);
    }
    // 데이터 가공하기!
    // data 를 가지고 DB INSERT.
    // DB에 id가 auto increasment든 max+1이든 id 생성후 insert
    // 방금 insert된 값의 id를 가져와서
 
};
 
exports.scheduleModify = async function(req, res, next){}
exports.scheduleDelete = async function(req, res, next){}