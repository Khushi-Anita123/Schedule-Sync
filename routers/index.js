const express = require('express');
const router = express.Router();
const controller = require('../controller/indexController'); 
const authenticateToken = require('../middleware/authentication');

router.post('/Signup', controller.Signup);
router.post('/Login', controller.Login);
router.post('/Logout', controller.Logout);

router.post('/lecture', controller.lecture);
router.get('/teacher/timetable', authenticateToken, controller.getMyTimetable);
router.get('/timetable/:email', controller.getTimetableByEmail);
router.get('/teachers', controller.teachers);

module.exports = router;
