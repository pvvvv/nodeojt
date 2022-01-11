var db = require("../../models");
var sequelize = require('sequelize');
var moment = require('moment');

exports.iframeSchedulerPage = async function(req, res, next){
    var schedulerData = await db.scheduler.findAll({});
    data = schedulerData;

    for(i=0; i < data.length ; i++){
        var titleMix = "["+data[i].location+"]"+"["+data[i].name+"]"+"["+data[i].title+"]";
        data[i].title = titleMix;
    }

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
    console.log("1번");
    try {
        var findData = await db.scheduler.findAll({
            where : {
                [OP.or]:[
                    {
                        startDate : {
                            [OP.gte] : minTime,// >=
                            [OP.lte] : maxTime // <= 
                        }
                    },
                    {
                        startDate :{
                            [OP.lte] : minTime // <=
                        },
                        endDate : {
                            [OP.gte] : maxTime // <=
                        }
                    },
                    {
                        endDate : {
                            [OP.lte] : maxTime,
                            [OP.gte] : minTime
                        }
                    },
                ],
                location : {
                    [OP.like] : '%' + roomName + '%'
                }
            },
            order: [['startDate', 'ASC']]
        });
        
        return res.status(200).json(findData);
    } catch (error) {
        next(error);
    };
};

/* 스케줄 인서트 */
exports.scheduleInsert = async function(req, res, next){
    var {name, location, title, startDate, startTime, endDate, endTime, allday} = req.body;
    var id = req.session.user.ID;
    var category;
    var start = startDate+"T"+startTime;
    var end = endDate+"T"+endTime;
    console.log("2번");
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

exports.findClosestTime = async function(req, res, next){
    console.log("3번");
    var OP = sequelize.Op;
    var {startDate, startTime, roomName} = req.body;
    var endDateMin = startDate+"T00:00:00";
    var endDateMax = startDate+"T23:59:59";
    var start = startDate+"T"+startTime;

    try {
        /* 내가 정한 날짜에 시작하는 데이터가 있는지? */
        var tempData = await db.scheduler.findAll({
            where : {
                startDate : {
                    [OP.gte] : start,// >=
                },
                startDate : {
                    [OP.gte] : endDateMin,
                    [OP.lte] : endDateMax
                },     
                location : roomName
            },
            order : [['startDate', 'asc']],
        });

        /* 데이터가 1개 이상이거나 */
        if(tempData.length >= 1){
            console.log("hh11")
            var tempLastLength = tempData.length -1
            var tempEndDate = (tempData[tempLastLength].endDate).substring(0, 10);

            /* 가져온 데이터가 1개 이상이고 내가 선택한 시작 날짜와 가져온 데이터의 종료날짜가 같다면 */
            if(startDate == tempEndDate){
                console.log("여길 왔습니다2");
                var findData = await db.scheduler.findOne({
                    where : {
                        startDate : {
                            [OP.gte] : start,// >=
                        },
                        location : roomName
                    },
                    order : [['startDate', 'asc']],
                });
            }/* 가져온 데이터가 1개 이상이고 내가 선택한 시작 날짜와 가져온 데이터의 종료날짜가 다르다면 */
            else if(startDate !== tempEndDate){
                console.log("여길 왔습니다3");
                var findData = await db.scheduler.findOne({
                    where : {
                        startDate : {
                            [OP.gte] : start,// >=
                        },
                        location : roomName
                    },
                    order : [['startDate', 'asc']],
                });
            }
        }

        /* 만약 조회했는데 값이 없다면? */
        if(tempData == ""){
            console.log("여길 왔습니다1");
            var findData = await db.scheduler.findOne({
                where : {
                    [OP.or] : [
                        {
                            startDate : {
                                [OP.gte] : start,// >=
                            },
                        },
                        {
                            endDate : {
                                [OP.gte] : endDateMin,
                                [OP.lte] : endDateMax
                            }
                        },
                        db.sequelize.where(db.sequelize.literal('\''+endDateMax+'\''), {
                            [OP.between] : [
                                db.sequelize.col("startDate"),
                                db.sequelize.col("endDate"),
                            ],
                        }),
                        
                    ],
                    location : roomName
                },
                order : [['startDate', 'asc']],
            });
        }

        // var findData = await db.scheduler.findOne({
        //     where : {
        //         [OP.or] : [
        //             {
        //                 startDate : {
        //                     [OP.gte] : start,// >=
        //                 },
        //             },
        //             {
        //                 endDate : {
        //                     [OP.gte] : endDateMin,
        //                     [OP.lte] : endDateMax
        //                 }
        //             },
        //             db.sequelize.where(db.sequelize.literal('\''+endDateMax+'\''), {
        //                 [OP.between] : [
        //                     db.sequelize.col("startDate"),
        //                     db.sequelize.col("endDate"),
        //                 ],
        //             }),
                    
        //         ],
        //         location : roomName
        //     },
        //     order : [['startDate', 'asc']],
        // });
 
        res.json(findData);
    } catch (error) {
        next(error);
    };

}

exports.findEndDate = async function(req, res, next){
    var OP = sequelize.Op;
    var {endDate, roomName, endTime} = req.body;
    var start = endDate+"T"+endTime;

    console.log(start);

    try{
        var findData = await db.scheduler.findOne({
            where : {
                startDate : {
                    [OP.gte] : start,// >=
                },
                location : roomName
            },
            order : [['startDate', 'asc']],
        });
        
        return res.status(200).json(findData);
    } catch (error) {
        next(error);
    }
}

 
exports.scheduleModify = async function(req, res, next){}
exports.scheduleDelete = async function(req, res, next){}