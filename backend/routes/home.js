var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var {convertDate, showPrice} = require('../config/dateConvert');
var File = require('../models/File');
var Estate = require('../models/Estate');
var User = require('../models/User');
const sms2 = require('../config/sms2');
const sms = require('../config/sms');
router.get('/correctpishforosh', (req, res, next) => {
    File.updateMany({state: 'پیش.فروش'}, {$set: {state: 'پیش‌فروش'}}, (err) => {
        res.send('done');
    });
})
router.get('/', (req, res, next) => {
    File.find({}, (err, files) => {
        now = new Date();
        res.render('home', {
            convertDate,
            now,
            numberOfFiles: files.length,
            numberOfSellings: files.filter(e => e.state == 'فروش').length,
            numberOfSellings2: files.filter(e => e.state == 'پیش‌فروش').length,
            numberOfRents: files.filter(e => e.state == 'رهن و اجاره' || e.state == 'رهن کامل').length,
            numberOfApartments: files.filter(e => e.type == 'آپارتمان').length,
            numberOfOffices: files.filter(e => e.type == 'اداری' || e.type == 'تجاری').length,
            numberOfOthers: files.filter(e => e.type == 'مستغلات' || e.type == 'کلنگی').length,
        });
    })
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
router.get('/contactus', (req, res, next) => {
    res.render('contactus', {
        
    })
});
router.post('/contactus', (req, res, next) => {
    text = `تماس با ما:\nنام: ${req.body.fullname}\nتلفن: ${req.body.phone}\n\n${req.body.text}`;
    sms2('09336448037', text);
    // sms2('09129630587', text);
    // sms2('09351248932', text);
    req.flash('success_msg', 'پیام شما با موفقیت ارسال شد.');
    res.redirect('/contactus');
});
module.exports = router;
