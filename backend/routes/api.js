var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');
var Notif = require('../models/Notif');
var Settings = require('../models/Settings');
var News = require('../models/News');
var Payment = require('../models/Payment');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('18286cd3-6065-4a7a-ad43-05eaf70f01a6', false);
const { ensureAuthenticated } = require('../config/auth');
const sms = require('../config/sms');
var {convertDate, get_year_month_day, jalali_to_gregorian} = require('../config/dateConvert');

router.get('/', (req, res, next) => {
    res.send('API called successfully');
});
router.get('/login', (req, res, next) => {
    var {username, password, key} = req.query;
    Estate.findOne({code: parseInt(username), password: password}, (err, estate) => {
        if(estate){
            if(estate.windowsKey == '' || key == estate.windowsKey){
                res.send({correct: true, keyQualified: true, estate});
            }else{
                res.send({correct: true, keyQualified: false, estate});
            }
        }
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
router.get('/get-files-new', (req, res, next) => {
    var {username, password, noplan} = req.query;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate){
            if((estate.payed && estate.planType != 'free') || noplan){
                File.find({}, (err, files) => {
                    for(var i=0; i<files.length; i++){
                        if(estate.selectedareas.indexOf(files[i].area) == -1){files.splice(i, 1); i--;}
                        else if(estate.role == 'user'){
                            if(!estate.userpermissionrent && (files[i].state == 'رهن و اجاره' || files[i].state == 'رهن کامل')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionsell && (files[i].state == 'فروش' || files[i].state == 'پیش‌فروش')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionchange && (files[i].state == 'معاوضه' || files[i].state == 'مشارکت')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionapartment && (files[i].type == 'آپارتمان' || files[i].type == 'ویلایی')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionoffice && (files[i].type == 'اداری' || files[i].type == 'موقعیت اداری' || files[i].type == 'تجاری')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionfeild && (files[i].type == 'کلنگی' || files[i].type == 'زمین' || files[i].type == 'مستغلات')) {files.splice(i, 1); i--;}
                        }
                    }
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
router.post('/get-files2-new', (req, res, next) => {
    var {username, password} = req.body;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate){
            if(estate.payed && estate.planType != 'free'){
                File.find({}, (err, files) => {
                    for(var i=0; i<files.length; i++){
                        if(estate.selectedareas.indexOf(files[i].area) == -1){files.splice(i, 1); i--;}
                        else if(estate.role == 'user'){
                            if(!estate.userpermissionrent && (files[i].state == 'رهن و اجاره' || files[i].state == 'رهن کامل')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionsell && (files[i].state == 'فروش' || files[i].state == 'پیش‌فروش')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionchange && (files[i].state == 'معاوضه' || files[i].state == 'مشارکت')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionapartment && (files[i].type == 'آپارتمان' || files[i].type == 'ویلایی')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionoffice && (files[i].type == 'اداری' || files[i].type == 'موقعیت اداری' || files[i].type == 'تجاری')) {files.splice(i, 1); i--;}
                            else if(!estate.userpermissionfeild && (files[i].type == 'کلنگی' || files[i].type == 'زمین' || files[i].type == 'مستغلات')) {files.splice(i, 1); i--;}
                        }
                    }
                    var now = new Date();
                    files.reverse();
                    // files.filter(e => now - e.creationDate.getTime() < 15 * 24 * 60 * 60 * 1000);
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
router.get('/pay-estate2', (req, res, next) => {
    var {username, password, plan, paymentfullprice, paymentdiscount, paymentpayable, selectedareas, planusernum} = req.query;
    selectedareas = selectedareas.split(',');
    amounts = [170000, 470000, 680000, 1469000];
    names = ['1 ماهه', '3 ماهه', '6 ماهه', '1 ساله'];
    Settings.findOne({}, (err, settings) => {
        amounts = [settings.oneMonth, settings.threeMonth, settings.sixMonth, settings.oneYear];
        Estate.findOne({code: username, password: password}, (err, estate) => {
            if(estate){
                zarinpal.PaymentRequest({
                    Amount: paymentfullprice.toString(), // In Tomans
                    // CallbackURL: 'http://185.81.99.34:3000/api/payment-call-back2',
                    CallbackURL: 'http://fileestore.ir/api/payment-call-back2',
                    Description: `خرید اشتراک ${names[parseInt(plan)]} توسط ${estate.name}`,
                    Email: '',
                    Mobile: estate.phone,
                }).then(response => {
                    if (response.status === 100) {
                        Estate.updateMany({code: username, password: password}, {$set: {
                            selectedareas, 
                            planusernum, 
                            authority: response.authority, 
                            planType: names[parseInt(plan)],
                            normalUserIDs: [],
                        }}, (err, doc) => {
                            var newPayment = new Payment({
                                username: parseInt(username),
                                EstateID: estate._id,
                                paymentfullprice,
                                paymentdiscount,
                                paymentpayable,
                                selectedareas,
                                planusernum,
                                plan,
                                planName: names[parseInt(plan)],
                                date: new Date(),
                                jDate: convertDate(new Date()),
                                authority: response.authority,
                            });
                            console.log(response.authority)
                            newPayment.save().then(doc => {
                                res.redirect(response.url);
                            }).catch(err => console.log(err));
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
router.get('/payment-call-back2', (req, res, next) => {
    var {Authority, Status} = req.query;
    if(Status == 'OK'){
        Estate.findOne({authority: Authority}, (err, estate) => {
            Payment.findOne({authority: Authority}, (err, payment) => {
                Estate.updateMany({authority: Authority}, {$set: {payed: true, payDate: new Date(), authority: ''}}, (err, doc) => {
                    Payment.updateMany({authority: Authority}, {$set: {payed: true, authority: ''}}, (err, doc) => {
                        sms(estate.phone, `اشتراک ${estate.planType} شما فعال شد\n فایل استور`);
                        var newNotif = new Notif({type: 'payment', text: `خرید اشتراک ${estate.planType} توسط ${estate.name}`, date: new Date()});
                        newNotif.save().then(doc => {}).catch(err => console.log(err));
                        res.render('./api/success-payment', {estate});
                    });
                });
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
router.get('/set-login-key', (req, res, next) => {
    var {key, username, password} = req.query;
    Estate.updateMany({code: parseInt(username), password: password}, {$set: {windowsKey: key}}, (err) => {
        if(err) console.log(err);
        res.send({status: 'ok'});
    });
});
router.get('/get-factors', (req, res, next) => {
    var {username} = req.query;
    Payment.find({username, payed: true}, (err, payments) => {
        res.send({status: 'ok', payments});
    });
});
router.get('/add-normal-user', (req, res, next) => {
    var {username, fullname, phone, address, password, userpermissionrent, userpermissionsell, userpermissionchange, userpermissionapartment, userpermissionoffice, userpermissionfeild} = req.query;
    console.log(req.query);
    Estate.findOne({phone, role: 'user'}, (err, userExist) => {
        if(userExist){
            res.send({status: 'error', msg: 'user-exists'})
        }else{
            Estate.findOne({code: username}, (err, estate) => {
                Estate.find({}, (err, estates) => {
                    if(estate.normalUserIDs.length+1 < estate.planusernum){
                        var code = 1000;
                        for(var i=0; i<estates.length; i++){
                            if(code < estates[i].code)
                                code = estates[i].code;
                        }
                        var newEstate = new Estate({
                            name: fullname,
                            phone,
                            address,
                            role: 'user',
                            selectedareas: estate.selectedareas,
                            planType: estate.planType,
                            payDate: estate.payDate,
                            payed: estate.payed,
                            code: code+1,
                            parentEstateID: estate._id,
                            password,
                            userpermissionrent: userpermissionrent == 'true'? true : false,
                            userpermissionsell: userpermissionsell == 'true'? true : false,
                            userpermissionchange: userpermissionchange == 'true'? true : false,
                            userpermissionapartment: userpermissionapartment == 'true'? true : false,
                            userpermissionoffice: userpermissionoffice == 'true'? true : false,
                            userpermissionfeild: userpermissionfeild == 'true'? true : false,
                        });
                        newEstate.save().then(doc => {
                            estate.normalUserIDs.push(newEstate._id);
                            Estate.updateMany({code: username}, {$set: {normalUserIDs: estate.normalUserIDs}}, (err, doc) => {
                                res.send({status: 'ok', newEstate})
                            })
                        }).catch(err => console.log(err));
                    }
                    else res.send({status: 'error', msg: 'out-of-range'});
                });
            });
        }
    });
});
router.get('/get-normal-user', (req, res, next) => {
    var {username} = req.query;
    Estate.findOne({code: username}, (err, estate) => {
        Estate.find({parentEstateID: estate._id.toString()}, (err, normalUsers) => {
            res.send({status: 'ok', normalUsers})
        });
    });
});
router.get('/delete-normal-user', (req, res, next) => {
    var {userID} = req.query;
    Estate.findById(userID, (err, estate) => {
        Estate.findById(estate.parentEstateID, (err, parent) => {
            for(var i=0; i< parent.normalUserIDs.length; i++){
                if(parent.normalUserIDs[i] == userID){
                    parent.normalUserIDs.splice(i, 1);
                    i -= 1;
                }
            }
            Estate.updateMany({_id: estate.parentEstateID}, {$set: {normalUserIDs: parent.normalUserIDs}}, (err, doc) => {
                Estate.deleteMany({_id: userID}, (err) => {
                    res.send({status: 'ok'})
                });
            })
        });
    });
});
router.get('/login-normal-user', (req, res, next) => {
    var {phone, password, key} = req.query;
    Estate.findOne({phone, password, role: 'user'}, (err, estate) => {
        if(estate){
            if(estate.windowsKey == '' || key == estate.windowsKey){
                res.send({correct: true, keyQualified: true, estate});
            }else{
                res.send({correct: true, keyQualified: false, estate});
            }
        }
        else
            res.send({correct: false});
    })
});

module.exports = router;
