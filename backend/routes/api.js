var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');
var Notif = require('../models/Notif');
var Settings = require('../models/Settings');
var News = require('../models/News');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('18286cd3-6065-4a7a-ad43-05eaf70f01a6', false);
const { ensureAuthenticated } = require('../config/auth');
const sms = require('../config/sms');

router.get('/', (req, res, next) => {
    res.send('API called successfully');
});
router.get('/login', (req, res, next) => {
    var {username, password} = req.query;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate)
            res.send({correct: true, estate});
        else
            res.send({correct: false});
    })
});
router.get('/get-files', (req, res, next) => {
    var {username, password, noplan} = req.query;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate){
            if((estate.payed && estate.planType != 'free') || noplan){
                File.find({area: estate.area}, (err, files) => {
                    var now = new Date();
                    files.reverse();
                    files.filter(e => now - e.creationDate.getTime() < 15 * 24 * 60 * 60 * 1000);
                    if(noplan){
                        for(var i=0; i<files.length; i++){
                            files[i].address = '-';
                            files[i].phone = '-';
                            files[i].constPhone = '-';
                            files[i].images = [];
                        }
                    }
                    res.send({status: 'ok', files});

                    estate.lastRefreshFiles = [];
                    for(var i=0; i<files.length; i++){
                        estate.lastRefreshFiles.push(files[i].fileNumber);
                        
                    }
                    Estate.updateMany({_id: estate._id}, {$set: {lastRefreshFiles: estate.lastRefreshFiles}}, err => {
                        if(err) console.log(err);
                    })
                });
            }
            else res.send({status: 'not payed'})
        }
        else res.send({status: 'error'})
    })
});
router.post('/get-files2', (req, res, next) => {
    var {username, password} = req.body;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate){
            if(estate.payed && estate.planType != 'free'){
                File.find({area: estate.area}, (err, files) => {
                    var now = new Date();
                    files.reverse();
                    files.filter(e => now - e.creationDate.getTime() < 15 * 24 * 60 * 60 * 1000);
                    var newFiles = [];
                    for (let i = 0; i < files.length; i++) {
                        if(estate.lastRefreshFiles.indexOf(files[i].fileNumber) == -1){
                            newFiles.push(files[i]);
                            estate.lastRefreshFiles.push(files[i].fileNumber);
                        }
                    }
                    res.send({status: 'ok', files: newFiles});
                    Estate.updateMany({_id: estate._id}, {$set: {lastRefreshFiles: estate.lastRefreshFiles}}, err => {
                        if(err) console.log(err);
                    })
                });
            }
            else res.send({status: 'not payed'})
        }
        else res.send({status: 'error'})
    })
});
router.get('/pay-estate', (req, res, next) => {
    var {username, password, plan} = req.query;
    amounts = [170000, 470000, 680000, 1469000];
    names = ['1 ماهه', '3 ماهه', '6 ماهه', '1 ساله'];
    Settings.findOne({}, (err, settings) => {
        amounts = [settings.oneMonth, settings.threeMonth, settings.sixMonth, settings.oneYear];
        console.log(amounts);
        Estate.findOne({code: username, password: password}, (err, estate) => {
            if(estate){
                zarinpal.PaymentRequest({
                    Amount: amounts[parseInt(plan)].toString(), // In Tomans
                    CallbackURL: 'http://185.81.99.34:3000/api/payment-call-back',
                    Description: `خرید اشتراک ${names[parseInt(plan)]} توسط ${estate.name}`,
                    Email: '',
                    Mobile: estate.phone
                }).then(response => {
                    if (response.status === 100) {
                        Estate.updateMany({code: username, password: password}, {$set: {
                            authority: response.authority, 
                            planType: names[parseInt(plan)]
                        }}, (err, doc) => {
                            console.log(response);
                            res.redirect(response.url);
                        });
                    }
                }).catch(err => {
                    console.error(err);
                });
            }
            else res.send({status: 'error'});
        });
    });
});
router.get('/payment-call-back', (req, res, next) => {
    var {Authority, Status} = req.query;
    if(Status == 'OK'){
        Estate.findOne({authority: Authority}, (err, estate) => {
            Estate.updateMany({authority: Authority}, {$set: {payed: true, payDate: new Date(), authority: ''}}, (err, doc) => {
                sms(estate.phone, `اشتراک ${estate.planType} شما فعال شد\n فایل استور`);
                var newNotif = new Notif({type: 'payment', text: `خرید اشتراک ${estate.planType} توسط ${estate.name}`, date: new Date()});
                newNotif.save().then(doc => {}).catch(err => console.log(err));
                res.render('./api/success-payment', {estate});
            });
        });
    }
});
router.get('/add-notif', (req, res, next) => {
    var newNotif = new Notif({type: 'payment', text: `خرید اشتراک test توسط test`, date: new Date()});
    newNotif.save().then(doc => {}).catch(err => console.log(err));
    res.send('ok');

});
router.get('/get-settings', (req, res, next) => {
    Settings.findOne({}, (err, settings) => {
        res.send({settings});
    })
});
router.get('/get-news', (req, res, next) => {
    var {username, password} = req.query;
    News.find({}, (err, news) => {
        res.send(news);
        for(var i=0; i<news.length; i++){
            if(news[i].seenBy.indexOf(username) == -1){
                news[i].seenBy.push(username);
                news[i].seen += 1;
                News.updateMany({_id: news[i]._id}, {$set: {seenBy: news[i].seenBy, seen: news[i].seen}}, (err, doc) => {});
            }
        }
    });
});



module.exports = router;
