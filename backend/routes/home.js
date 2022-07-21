var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
var {convertDate, showPrice, get_year_month_day, getToday} = require('../config/dateConvert');
var File = require('../models/File');
var Estate = require('../models/Estate');
var User = require('../models/User');
var Notif = require('../models/Notif');
var Settings = require('../models/Settings');
const sms2 = require('../config/sms2');
const sms = require('../config/sms');
let district22Ratio = 100, district5Ratio = 100;
let numberOfFiles, numberOfSellings, numberOfSellings2, numberOfRents, numberOfApartments, numberOfOffices, numberOfOthers, numberOfdistrict22, numberOfdistrict5, numberOfdistrict22Today, numberOfdistrict5Today;
var updateFileRatio = () => {
    var today = getToday();
    File.find({area: '22'}, (err, files) => {
        var days = [], sum = 0;
        numberOfdistrict22Today = 0;
        for(var i=0; i<files.length; i++){
            if(files[i].date == today) numberOfdistrict22Today++;
            if(days.find(e => e.date == files[i].date)){
                for(var j=0; j<days.length; j++){
                    if(days[j].date == files[i].date){
                        days[j].num++;
                        sum++;
                    }
                }
            }
            else{
                days.push({date: files[i].date, num: 1});
                sum++;
            }
        }
        district22Ratio = sum / days.length; 
    })
    File.find({area: '5'}, (err, files) => {
        var days = [], sum = 0;
        numberOfdistrict5Today = 0;
        for(var i=0; i<files.length; i++){
            if(files[i].date == today) numberOfdistrict5Today++;
            if(days.find(e => e.date == files[i].date)){
                for(var j=0; j<days.length; j++){
                    if(days[j].date == files[i].date){
                        days[j].num++;
                        sum++;
                    }
                }
            }
            else{
                days.push({date: files[i].date, num: 1});
                sum++;
            }
        }
        district5Ratio = sum / days.length; 
    })
    File.find({}, (err, files) => {
        numberOfFiles = files.length;
        numberOfSellings = files.filter(e => e.state == 'فروش').length;
        numberOfSellings2 = files.filter(e => e.state == 'پیش‌فروش').length;
        numberOfRents = files.filter(e => e.state == 'رهن و اجاره' || e.state == 'رهن کامل').length;
        numberOfApartments = files.filter(e => e.type == 'آپارتمان').length;
        numberOfOffices = files.filter(e => e.type == 'اداری' || e.type == 'تجاری').length;
        numberOfOthers = files.filter(e => e.type == 'مستغلات' || e.type == 'کلنگی').length;
        numberOfdistrict22 = files.filter(e => e.area == '22').length;
        numberOfdistrict5 = files.filter(e => e.area == '5').length;
    });
}
updateFileRatio();
setInterval(updateFileRatio, 1000 * 60 * 5);

router.get('/correctpishforosh', (req, res, next) => {
    File.updateMany({$or: [
        {state: 'پیش.فروش'}, 
        {state: 'پیش . فروش'}, 
        {state: 'پیش. فروش'}, 
        {state: 'پیش .فروش'}, 
        {state: 'پیش فروش'}
    ]}, {$set: {state: 'پیش‌فروش'}}, (err) => {
        res.send('done');
    });
})
router.get('/', (req, res, next) => {
    Settings.findOne({}, (err, settings) => {
        console.log(settings)
        now = new Date();
        res.render('home', {
            convertDate,
            now,
            settings,
            numberOfFiles,
            numberOfSellings,
            numberOfSellings2,
            numberOfRents,
            numberOfApartments,
            numberOfOffices,
            numberOfOthers,
            numberOfdistrict22,
            numberOfdistrict5,
            district22Ratio,
            district5Ratio,
            numberOfdistrict22Today,
            numberOfdistrict5Today
        });
    });
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
    var newNotif = new Notif({
        type: 'register-estate',
        text: text,
        date: new Date(),
    });
    newNotif.save().then(doc => {}).catch(err => console.log(err));
    res.redirect('/');
});
router.post('/register-file', (req, res, next) => {
    var {phone, name, area} = req.body;
    sms2(phone, 'درخواست سپردن ملک در فایل استور در حال بر رسی است.');
    text = `درخواست سپردن ملک در فایل استور:\nتلفن: ${phone}\nنام: ${name}\nمنطقه: ${area}`;
    sms2('09336448037', text);
    sms2('09129630587', text);
    sms2('09351248932', text);
    var newNotif = new Notif({
        type: 'register-estate',
        text: text,
        date: new Date(),
    });
    newNotif.save().then(doc => {}).catch(err => console.log(err));
    res.redirect('/');
});
router.get('/contactus', (req, res, next) => {
    res.render('contactus', {
        
    })
});
router.post('/contactus', (req, res, next) => {
    text = `تماس با ما:\nنام: ${req.body.fullname}\nتلفن: ${req.body.phone}\n\n${req.body.text}`;
    sms2('09336448037', text);
    sms2('09129630587', text);
    sms2('09351248932', text);
    req.flash('success_msg', 'پیام شما با موفقیت ارسال شد.');
    res.redirect('/contactus');
});
router.get('/correct-mostaghelat', (req, res, next) => {
    File.updateMany({type: 'مستقلات'}, {$set: {type: 'مستغلات'}}, (err) => {
        res.send('done');
    });
})
router.get('/test', (req, res, next) => {
    File.find({state: 'مشارکت', type: 'زمین', area: '22'}, (err, files) => {
        res.send(files.length.toString());
    })
});
router.get('/enamad', (req, res, next) => {
    res.render('enamad-test');
})
router.get('/return-guarantee', (req, res, next) => {
    res.render('./return-guarantee')
});

module.exports = router;
