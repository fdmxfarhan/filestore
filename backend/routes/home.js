var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const sms2 = require('../config/sms2');

router.get('/', (req, res, next) => {
    // res.redirect('/users/login');
    res.render('home');
});

router.get('/privacy-policy', (req, res, next) => {
    res.render('privacy-policy');
});
router.post('/newsletter', (req, res, next) => {
    var {phone} = req.body;
    sms2(phone, 'درخواست عضویت در فایل استور در حال بر رسی است.');
    sms2('09336448037', `درخواست عضویت در فایل استور:\n${phone}`);
    sms2('09129630587', `درخواست عضویت در فایل استور:\n${phone}`);
    res.redirect('/');
});
module.exports = router;
