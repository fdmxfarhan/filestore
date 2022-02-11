var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const sms2 = require('../config/sms2');
const sms = require('../config/sms');


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
    sms2('09351248932', `درخواست عضویت در فایل استور:\n${phone}`);
    res.redirect('/');
});
router.post('/register-estate', (req, res, next) => {
    var {phone, name} = req.body;
    sms2(phone, 'درخواست عضویت در فایل استور در حال بر رسی است.');
    text = `درخواست عضویت در فایل استور:\nتلفن: ${phone}\nنام: ${name}`;
    sms2('09336448037', text);
    sms2('09129630587', text);
    sms2('09351248932', text);
    res.redirect('/');
});
router.post('/register-estate', (req, res, next) => {
    var {phone, name, area} = req.body;
    sms2(phone, 'درخواست سپردن ملک در فایل استور در حال بر رسی است.');
    text = `درخواست سپردن ملک در فایل استور:\nتلفن: ${phone}\nنام: ${name}\nمنطقه: ${area}`;
    sms2('09336448037', text);
    sms2('09129630587', text);
    sms2('09351248932', text);
    res.redirect('/');
});

module.exports = router;
