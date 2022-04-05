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
var {convertDate, showPrice, showPrice2} = require('../config/dateConvert');
var phantomjs = require('phantomjs');
var pdf = require("pdf-creator-node");
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcryptjs');
const reader = require('xlsx');

// const excelFile = reader.readFile(__dirname + '/../public/files.xlsx');


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
        res.redirect('/dashboard/files');
        // res.render('./dashboard/admin-dashboard', {
        //     user: req.user,
        //     login: req.query.login,
        // });
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
    var page = req.query.page;
    if(!page) page = 0;
    page = parseInt(page);
    if(req.user.role == 'admin'){
        var numberOfFilesInPage = 30;
        File.find({}, (err, files) => {
            var fileLength = files.length;
            files = files.slice(fileLength-1 - ((page+1)*numberOfFilesInPage), fileLength-1 - (page*numberOfFilesInPage))
            res.render('./dashboard/admin-files', {
                user: req.user,
                files,
                convertDate,
                page,
                numberOfFilesInPage,
                fileLength,
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
router.get('/pdf-file', ensureAuthenticated, (req, res, next) => {
    var {fileID} = req.query;
    File.findById(fileID, (err, file) => {
        var options = {
            phantomPath: path.join(__dirname, '../node_modules/phantomjs/lib/phantom/bin/phantomjs'),
            // phantomPath: '/usr/local/share/phantomjs-1.9.8-linux-x86_64/bin/phantomjs',
            format: "A3",
            orientation: "landscape",
            border: "5mm",
            header: {
                height: "0",
                contents: ''
            },
            footer: {
                height: "0mm",
                contents: {}
            },
        };
        fs.readFile('./public/file.html', 'utf8', (err, form1) => {
            var document1 = {
                html: form1,
                data: {
                    ownerName: file.ownerName == ''? '-' : file.ownerName,
                    constPhone: file.constPhone == ''? '-' : file.constPhone,
                    address: file.address == ''? '-' : file.address,
                    phone: file.phone == ''? '-' : file.phone,
                    date: file.date == ''? '-' : file.date,
                    type: file.type == ''? '-' : file.type,
                    fileNumber: file.fileNumber == ''? '-' : file.fileNumber,
                    state: file.state == ''? '-' : file.state,
                    role: file.role == ''? '-' : file.role,
                    meterage: file.meterage == ''? '-' : file.meterage,
                    bedroom: file.bedroom == ''? '-' : file.bedroom,
                    floor: file.floor == ''? '-' : file.floor,
                    numOfFloors: file.numOfFloors == ''? '-' : file.numOfFloors,
                    unit: file.unit == ''? '-' : file.unit,
                    buildAge: file.buildAge == ''? '-' : file.buildAge,
                    parking: file.parking == ''? '-' : file.parking,
                    warehouse: file.warehouse == ''? '-' : file.warehouse,
                    elevator: file.elevator == ''? '-' : file.elevator,
                    kitchen: file.kitchen == ''? '-' : file.kitchen,
                    view: file.view == ''? '-' : file.view,
                    floortype: file.floortype == ''? '-' : file.floortype,
                    service: file.service == ''? '-' : file.service,
                    heatingAndCoolingSystem: file.heatingAndCoolingSystem == ''? '-' : file.heatingAndCoolingSystem,
                    meterage2: file.meterage2 == ''? '-' : file.meterage2,
                    bedroom2: file.bedroom2 == ''? '-' : file.bedroom2,
                    floor2: file.floor2 == ''? '-' : file.floor2,
                    numOfFloors2: file.numOfFloors2 == ''? '-' : file.numOfFloors2,
                    unit2: file.unit2 == ''? '-' : file.unit2,
                    buildAge2: file.buildAge2 == ''? '-' : file.buildAge2,
                    parking2: file.parking2 == ''? '-' : file.parking2,
                    warehouse2: file.warehouse2 == ''? '-' : file.warehouse2,
                    elevator2: file.elevator2 == ''? '-' : file.elevator2,
                    kitchen2: file.kitchen2 == ''? '-' : file.kitchen2,
                    view2: file.view2 == ''? '-' : file.view2,
                    floortype2: file.floortype2 == ''? '-' : file.floortype2,
                    service2: file.service2 == ''? '-' : file.service2,
                    heatingAndCoolingSystem2: file.heatingAndCoolingSystem2 == ''? '-' : file.heatingAndCoolingSystem2,
                    meterage3: file.meterage3 == ''? '-' : file.meterage3,
                    bedroom3: file.bedroom3 == ''? '-' : file.bedroom3,
                    floor3: file.floor3 == ''? '-' : file.floor3,
                    numOfFloors3: file.numOfFloors3 == ''? '-' : file.numOfFloors3,
                    unit3: file.unit3 == ''? '-' : file.unit3,
                    buildAge3: file.buildAge3 == ''? '-' : file.buildAge3,
                    parking3: file.parking3 == ''? '-' : file.parking3,
                    warehouse3: file.warehouse3 == ''? '-' : file.warehouse3,
                    elevator3: file.elevator3 == ''? '-' : file.elevator3,
                    kitchen3: file.kitchen3 == ''? '-' : file.kitchen3,
                    view3: file.view3 == ''? '-' : file.view3,
                    floortype3: file.floortype3 == ''? '-' : file.floortype3,
                    service3: file.service3 == ''? '-' : file.service3,
                    heatingAndCoolingSystem3: file.heatingAndCoolingSystem3 == ''? '-' : file.heatingAndCoolingSystem3,
                    options: file.options == ''? '-' : file.options,
                    price: file.price == ''? '-' : file.price,
                    fullPrice: file.fullPrice == ''? '-' : file.fullPrice,
                    area: file.area == ''? '-' : file.area,
                    lone: file.lone == ''? '-' : file.lone,
                    changable: file.changable == ''? '-' : file.changable,
                    discount: file.discount == ''? '-' : file.discount,
                    documentState: file.documentState == ''? '-' : file.documentState,
                    transfer: file.transfer == ''? '-' : file.transfer,
                    advertiser: file.advertiser == ''? '-' : file.advertiser,
                },
                path: 'public/files/file.pdf',
                type: "",
            };
            pdf.create(document1, options).then((r) => {
                res.sendFile(path.join(__dirname, '../public/files/file.pdf'));
                // res.render('pdf-file', {
                //     user: req.user,
                // });
            }).catch((error) => {console.error(error)});
        });
    });
});
router.post('/add-user', ensureAuthenticated, (req, res, next) => {
    var {fullname, idNumber, password, addFilePermission, removeFilePermission, editFilePermission, addEstatePermission, removeEstatePermission, editEstatePermission} = req.body;
    if(addFilePermission)      addFilePermission = true;
    else                       addFilePermission = false;
    if(removeFilePermission)   removeFilePermission = true;
    else                       removeFilePermission = false;
    if(editFilePermission)     editFilePermission = true;
    else                       editFilePermission = false;
    if(addEstatePermission)    addEstatePermission = true;
    else                       addEstatePermission = false;
    if(removeEstatePermission) removeEstatePermission = true;
    else                       removeEstatePermission = false;
    if(editEstatePermission)   editEstatePermission = true;
    else                       editEstatePermission = false;
    User.findOne({idNumber}, (err, user) => {
        if(user){
            req.flash('error_msg', 'شماره تلفن قبلا ثبت شده');
            res.redirect('/dashboard/users');
        }else{
            var newUser = new User({
                fullname, 
                idNumber, 
                password, 
                addFilePermission, 
                removeFilePermission, 
                editFilePermission, 
                addEstatePermission, 
                removeEstatePermission, 
                editEstatePermission,
                role: 'admin',
            });
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.save().then(doc => {
                    req.flash('success_msg', 'کاربر با موفقیت افزوده شد');
                    res.redirect('/dashboard/users');
                }).catch(err => console.log(err));
            }));
        }
    })
    
});
router.post('/upload-excel', ensureAuthenticated, upload.single('excelFile'), (req, res, next) => {
    var file = req.file, filePath;
    if(file) filePath = file.destination.slice(6) + '/' + file.originalname
    const excelFile = reader.readFile(__dirname + '/../public' + filePath);
    const sheets = excelFile.SheetNames;
    for(let i = 0; i < sheets.length; i++)
    {
        var newFile = new File({
            date: typeof(excelFile.Sheets[sheets[i]].B2) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B2.v,
            phone: typeof(excelFile.Sheets[sheets[i]].D2) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].D2.v,
            ownerName: typeof(excelFile.Sheets[sheets[i]].S2) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].S2.v,
            fileNumber: typeof(excelFile.Sheets[sheets[i]].B4) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B4.v,
            type: typeof(excelFile.Sheets[sheets[i]].D4) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].D4.v,
            address: typeof(excelFile.Sheets[sheets[i]].L4) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].L4.v,
            role: typeof(excelFile.Sheets[sheets[i]].B6) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B6.v,
            state: typeof(excelFile.Sheets[sheets[i]].D6) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].D6.v,
            area: 22,
            meterage: typeof(excelFile.Sheets[sheets[i]].AA9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].AA9.v,
            bedroom: typeof(excelFile.Sheets[sheets[i]].X9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].X9.v,
            floor: typeof(excelFile.Sheets[sheets[i]].W9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].W9.v,
            numOfFloors: typeof(excelFile.Sheets[sheets[i]].U9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].U9.v,
            unit: typeof(excelFile.Sheets[sheets[i]].T9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].T9.v,
            buildAge: typeof(excelFile.Sheets[sheets[i]].R9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].R9.v,
            parking: typeof(excelFile.Sheets[sheets[i]].P9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].P9.v,
            warehouse: typeof(excelFile.Sheets[sheets[i]].N9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].N9.v,
            elevator: typeof(excelFile.Sheets[sheets[i]].K9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].K9.v,
            kitchen: typeof(excelFile.Sheets[sheets[i]].H9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].H9.v,
            view: typeof(excelFile.Sheets[sheets[i]].G9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].G9.v,
            floortype: typeof(excelFile.Sheets[sheets[i]].D9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].D9.v,
            service: typeof(excelFile.Sheets[sheets[i]].C9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].C9.v,
            heatingAndCoolingSystem: typeof(excelFile.Sheets[sheets[i]].B9) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B9.v,
            options: typeof(excelFile.Sheets[sheets[i]].B12) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B12.v,
            price: typeof(excelFile.Sheets[sheets[i]].M14) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].M14.v,
            fullPrice: typeof(excelFile.Sheets[sheets[i]].B14) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].B14.v,
            lone: typeof(excelFile.Sheets[sheets[i]].AA16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].AA16.v,
            changable: typeof(excelFile.Sheets[sheets[i]].V16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].V16.v,
            discount: typeof(excelFile.Sheets[sheets[i]].S16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].S16.v,
            documentState: typeof(excelFile.Sheets[sheets[i]].O16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].O16.v,
            transfer: typeof(excelFile.Sheets[sheets[i]].J16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].J16.v,
            advertiser: typeof(excelFile.Sheets[sheets[i]].E16) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].E16.v,
            creationDate: new Date(),
        });
        newFile.save().then(doc => {}).catch(err => console.log(err));
    }
    res.redirect('/dashboard/files');
});
router.get('/file-view', ensureAuthenticated, (req, res, next) => {
    var {fileID} = req.query;
    File.findById(fileID, (err, file) => {
        res.render('./dashboard/admin-file-view', {
            user: req.user,
            file,
            showPrice: showPrice2
        });
    })
});

module.exports = router;
