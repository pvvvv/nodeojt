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

module.exports = router;