var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');
const mail = require('../config/mail');
const generateCode = require('../config/generateCode');
var bodyparser = require('body-parser');
const multer = require('multer');
const mkdirp = require('mkdirp');
var {convertDate} = require('../config/dateConvert');

router.use(bodyparser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'public/files/' + Date.now().toString();
        mkdirp(dir, err => cb(err, dir));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

setInterval(() => {
    Estate.find({}, (err, estates) => {
        for (let i = 0; i < estates.length; i++) {
            const estate = estates[i];
            if(estate.payDate){
                var payDate = (new Date(estate.payDate)).getTime();
                var now = (new Date()).getTime();
                var endDate = 0;
                if(estate.planType == 'trial')  endDate = payDate + 3 * 24 * 60 * 60 * 1000;
                if(estate.planType == '1 ماهه') endDate = payDate + 1 * 30 * 24 * 60 * 60 * 1000;
                if(estate.planType == '3 ماهه') endDate = payDate + 3 * 30 * 24 * 60 * 60 * 1000;
                if(estate.planType == '6 ماهه') endDate = payDate + 6 * 30 * 24 * 60 * 60 * 1000;
                if(estate.planType == '1 ساله') endDate = payDate + 12 * 30 * 24 * 60 * 60 * 1000;
                if(endDate - now < 0){
                    Estate.updateMany({_id: estate._id}, {$set: {
                        payed: false,
                        planType: 'free',
                    }}, (err) => {if(err) console.log(err)})
                }
            }
        }
    })
}, 1000 * 60);

router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'user')
    {
        res.render('./dashboard/user-dashboard', {
            user: req.user,
            login: req.query.login,
        });
    }
    else if(req.user.role = 'admin')
    {
        res.render('./dashboard/admin-dashboard', {
            user: req.user,
            login: req.query.login,
        });
    }
});
router.get('/users', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.find({}, (err, users) => {
            res.render('./dashboard/admin-users', {
                user: req.user,
                users,
            });
        })
    }
    else res.send('Access Denied');
});
router.get('/delete-user', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.deleteOne({_id: req.query.userID}, (err) => {
            req.flash('success_msg', 'کاربر با موفقیت حذف شد');
            res.redirect('/dashboard/users');
        });
    }
});
router.get('/estates', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Estate.find({}, (err, estates) => {
            res.render('./dashboard/admin-estates', {
                user: req.user,
                estates,
            });
        })
    }
    else res.send('Access Denied');
});
router.get('/files', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        File.find({}, (err, files) => {
            res.render('./dashboard/admin-files', {
                user: req.user,
                files,
                convertDate,
            });
        })
    }
    else res.send('Access Denied');
});
router.get('/settings', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        res.render('./dashboard/admin-settings', {
            user: req.user,
        });
    }
});
router.post('/add-estate', ensureAuthenticated, (req, res, next) => {
    var {name, address, phone, area, trial} = req.body;
    var planType = 'free', payed = false;
    if(trial) {
        planType = 'trial';
        payed = true;
    }
    if(req.user.role == 'admin'){
        Estate.find({}, (err, estates) => {
            if(!name || !address || !phone || !area){
                res.render('./dashboard/admin-estates', {
                    user: req.user,
                    estates,
                    errors: [{msg:'لطفا موارد خواسته شده را کامل نمایید.'}],
                    name, 
                    address, 
                    phone, 
                    area
                });
            }
            else{
                var code = 1000;
                for(var i=0; i<estates.length; i++){
                    if(code < estates[i].code)
                        code = estates[i].code;
                }
                var newEstate = new Estate({
                    name,
                    address,
                    phone,
                    area,
                    creationDate: new Date(),
                    code: code+1,
                    password: generateCode(4),
                    payAmount: 0,
                    planType,
                    payed,
                    payDate: new Date(),
                });
                newEstate.save().then(doc => {
                    res.redirect('/dashboard/estates');
                }).catch(err => console.log(err));
            }
        });
    }
});
router.get('/delete-estate', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Estate.deleteOne({_id: req.query.estateID}, (err) => {
            if(err) console.log(err);
            req.flash('success_msg', 'مشاور املاک با موفقیت حذف شد');
            res.redirect('/dashboard/estates');
        });
    }
});
router.post('/add-file', ensureAuthenticated, upload.single(`myFile`), (req, res, next) => {
    var body = req.body;
    var file = req.file;
    body.creationDate = new Date();
    if(req.user.role == 'admin'){
        body.images = [];
        if(file) body.images.push({link: file.destination.slice(6) + '/' + file.originalname})
        var newFile = new File(body);
        newFile.save().then(doc => {
            res.redirect('/dashboard/files');
        }).catch(err => console.log(err));
    }
});
router.post('/edit-file', ensureAuthenticated, upload.single(`myFile`), (req, res, next) => {
    var {fileID} = req.body;
    var body = req.body;
    var file = req.file;
    body.creationDate = new Date();
    if(req.user.role == 'admin'){
        File.findById(fileID, (err, f) => {
            body.images = f.images;
            if(file) body.images.push({link: file.destination.slice(6) + '/' + file.originalname})
            File.updateMany({_id: fileID}, {$set: body}, (err, doc) => {
                res.redirect('/dashboard/files');
            });
        })
    }
});
router.get('/delete-file', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        File.deleteOne({_id: req.query.fileID}, (err) => {
            if(err) console.log(err);
            req.flash('success_msg', 'فایل با موفقیت حذف شد');
            res.redirect('/dashboard/files');
        });
    }
});
router.get('/make-payed', ensureAuthenticated, (req, res, next) => {
    var {username} = req.query;
    Estate.updateMany({code: username}, {$set: {payed: true, payDate: new Date(), authority: '', planType: '1 ماهه'}}, (err, doc) => {
        res.redirect('/dashboard')
    });
});
router.get('/make-not-payed', ensureAuthenticated, (req, res, next) => {
    var {username} = req.query;
    Estate.updateMany({code: username}, {$set: {payed: false, planType: 'trial'}}, (err, doc) => {
        res.redirect('/dashboard')
    });
});

module.exports = router;
