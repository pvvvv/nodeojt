var express = require('express');
var router = express.Router();
var scheduleController = require('./scheduler-controller');

/* iframe url */
router.get('/iframe', scheduleController.iframeSchedulerPage);
/* GET schedule page. */
router.get('/', scheduleController.schedulerPage);
/* POST schedule page */
router.post('/', scheduleController.scheduleInsert);
/* put schedule page */
router.put('/', scheduleController.scheduleModify);
/* delete schedule page */
router.delete('/', scheduleController.scheduleDelete);

/* GET schedule InsertPage */
router.get('/insertpage', scheduleController.scheduleInsertPage);
/* 예약시 시간이 겹치지않도록 데이터를 조회하는 Ajax */
router.post('/findDate', scheduleController.findDate);
/* 시간 클릭시 그 시간과 가장 가까운 데이터를 조회하는 Ajax */
router.post('/closestTime', scheduleController.findClosestTime);



module.exports = router;