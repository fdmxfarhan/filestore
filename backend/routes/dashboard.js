var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');
var Notif = require('../models/Notif');
var Settings = require('../models/Settings');
var News = require('../models/News');
const mail = require('../config/mail');
const generateCode = require('../config/generateCode');
var bodyparser = require('body-parser');
const multer = require('multer');
const mkdirp = require('mkdirp');
var {convertDate, showPrice, showPrice2, get_year_month_day, jalali_to_gregorian, getAddress} = require('../config/dateConvert');
var phantomjs = require('phantomjs');
var pdf = require("pdf-creator-node");
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcryptjs');
const reader = require('xlsx');
var excel = require('excel4node');
var Jimp = require('jimp')


var strToArray = (str) => {
    arr = str.split(',');
    for(var i=0; i<arr.length; i++)
        arr[i] = parseInt(arr[i]);
    return arr;
}
var arrToStr = (arr) => {
    var str = '';
    for(var i=0; i<arr.length; i++){
        str += arr[i].toString();
        if(i<arr.length-1) str += ',';
    }
    return str;
}
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
var uploadFields = []
for(var i=0; i<200; i++){
    uploadFields.push({name: `file-${i}`, maxCount: 1});
}

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
                    Notif.find({type: estate._id.toString()}, (err, notifs) => {
                        if(!notifs || notifs.length <= 0){
                            var newNotif = new Notif({
                                type: estate._id.toString(),
                                text: `اشتراک ${estate.name} به پایان رسیده است.`,
                                date: new Date(),
                            })
                            newNotif.save().then(doc => {}).catch(err => console.log(err));
                        }
                    })
                    Estate.updateMany({_id: estate._id}, {$set: {
                        payed: false,
                        planType: 'free',
                    }}, (err) => {if(err) console.log(err)})
                }
                else{
                    Notif.deleteMany({type: estate._id.toString()}, (err) => {});
                }
            }
        }
    })
}, 1000 * 60 * 30);

Settings.findOne({}, (err, settings) => {
    if(!settings){
        var newSettings = new Settings();
        newSettings.save().then(() => console.log('new settings saved :)')).catch(err => console.log(err));
    }
})
router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'user')
    {
        res.render('./dashboard/user-dashboard', {
            user: req.user,
            login: req.query.login,
        });
    }
    else if(req.user.role == 'admin')
    {
        res.redirect('/dashboard/files');
    }
    else if(req.user.role == 'operator')
    {
        res.redirect('/dashboard/files');
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
            var districts = [];
            for(var i=0; i<estates.length; i++){
                if(districts.indexOf(estates[i].area) == -1) districts.push(estates[i].area)
            }
            res.render('./dashboard/admin-estates', {
                user: req.user,
                estates,
                districts,
                getAddress,
            });
        })
    }
    else res.send('Access Denied');
});
router.get('/files', ensureAuthenticated, (req, res, next) => {
    var page = req.query.page;
    var search = req.query.search;
    var areas = req.query.areas, areasArr;
    var removeArea = req.query.removeArea;
    var addArea = req.query.addArea;
    if(!page) page = 0;
    if(!areas) areas = 'all';
    else if(areas == '-1') {areas = ''; areasArr = []}
    else areasArr = strToArray(areas);
    page = parseInt(page);
    if(req.user.role == 'admin' || req.user.role == 'operator'){
        var numberOfFilesInPage = 30;
        File.find({}, (err, files) => {
            var allAreas = [];
            for(var i=0; i<files.length; i++)
                if(allAreas.indexOf(files[i].area) == -1 && files[i].area != '')
                    allAreas.push(files[i].area);
            if(areas == 'all'){
                areas = arrToStr(allAreas);
                areasArr = strToArray(areas);
            }
            if(removeArea){
                for(var i=0 ; i< areasArr.length; i++)
                if(areasArr[i].toString() == removeArea.toString())
                areasArr.splice(i, 1);
                if(areasArr.length == 0) areasArr.push(-1);
                areas = arrToStr(areasArr);
            }
            if(addArea){
                areasArr.push(parseInt(addArea));
                areas = arrToStr(areasArr);
            }
            files = files.filter(e => areasArr.indexOf(parseInt(e.area)) != -1);
            Notif.find({seen: false}, (err, seenNotifs) => {
                var newFileNumber = 0;
                for(var i=0; i<files.length; i++){
                    if(parseInt(files[i].fileNumber) > newFileNumber)
                        newFileNumber = parseInt(files[i].fileNumber);
                }
                var fileLength = files.length;
                var result = [];
                if(search){
                    for (let i = 0; i < files.length; i++) {
                        if(files[i].ownerName && files[i].ownerName.indexOf(search) != -1) result.push(files[i]);
                        else if(files[i].phone && files[i].phone.indexOf(search) != -1) result.push(files[i]);
                        else if(files[i].fileNumber && files[i].fileNumber.toString().indexOf(search) != -1) result.push(files[i]);
                        else if(files[i].address && files[i].address.indexOf(search) != -1) result.push(files[i]);
                    }
                }
                if(fileLength > numberOfFilesInPage)
                    files = files.slice(fileLength - ((page+1)*numberOfFilesInPage), fileLength - (page*numberOfFilesInPage))
                res.render('./dashboard/admin-files', {
                    user: req.user,
                    files,
                    convertDate,
                    page,
                    numberOfFilesInPage,
                    fileLength,
                    result,
                    search,
                    newFileNumber: newFileNumber+1,
                    now: new Date(),
                    seenNotifs,
                    getAddress,
                    get_year_month_day,
                    areas,
                    areasArr,
                    arrToStr,
                    strToArray,
                    allAreas,
                    getCorrectPrice: function(price){
                        if(typeof(price) != 'number') return '';
                        var text = price.toString();
                        if(typeof(text) != 'string') return '';
                        text = text.replaceAll('.', '');
                        text = text.replace(/\D/g,'');
                        var newText = '';
                        for(var i=0; i<text.length; i++){
                            var j = text.length - i;
                            if(j%3 == 0 && j>1 && i != 0) newText += '.';
                            newText += text[i];
                        }
                        return newText;
                    }
                });
            })
        })
    }
    else res.send('Access Denied');
});
router.get('/settings', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Settings.findOne({}, (err, settings) => {
            res.render('./dashboard/admin-settings', {
                user: req.user,
                settings,
            });
        })
    }
});
router.post('/save-settings', ensureAuthenticated, (req, res, next) => {
    Settings.updateMany({}, {$set: req.body}, (err) => {
        req.flash('success_msg', 'تغییرات با موفقیت ثبت شد.');
        res.redirect('/dashboard/settings');
    })
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
router.post('/add-multiple-estate', ensureAuthenticated, (req, res, next) => {
    var {numberOfEstates} = req.body;
    var planType = 'free', payed = false;
    // if(trial) {
    //     planType = 'trial';
    //     payed = true;
    // }
    var workbook = new excel.Workbook({
        dateFormat: 'm/d/yy hh:mm:ss'
    });
    var style = workbook.createStyle({
        font: {
        color: '#111111',
        size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });
    var worksheet = workbook.addWorksheet('users');
    worksheet.cell(1, 1 ).string('username').style(style);
    worksheet.cell(1, 2 ).string('password').style(style);
    if(req.user.role == 'admin'){
        Estate.find({}, (err, estates) => {
            var code = 1000;
            for(var i=0; i<estates.length; i++){
                if(code < estates[i].code)
                    code = estates[i].code;
            }
            for(var i=1; i<=parseInt(numberOfEstates); i++){
                var newEstate = new Estate({
                    name: `کاربر ${code + i}`,
                    address: '',
                    phone: '',
                    area: 22,
                    creationDate: new Date(),
                    code: code+i,
                    password: generateCode(4),
                    payAmount: 0,
                    planType,
                    payed,
                    payDate: new Date(),
                });
                worksheet.cell(i+1, 1 ).string(newEstate.code.toString()).style(style);
                worksheet.cell(i+1, 2 ).string(newEstate.password).style(style);
                newEstate.save().then(doc => {}).catch(err => console.log(err));
            }
            workbook.write(`./public/files/users.xlsx`, (err, stats) => {
                if(err) res.send(err);
                else {
                    req.flash('success_msg', 'فایل ها با موفقیت ساخته شدند.');
                    res.redirect('/dashboard/estates');
                }
            });
        });
    }
});
router.post('/edit-estate', ensureAuthenticated, (req, res, next) => {
    var {estateID} = req.body;
    var body = req.body;
    body.creationDate = new Date();
    if(req.user.role == 'admin'){
        Estate.updateMany({_id: estateID}, {$set: body}, (err, doc) => {
            res.redirect('/dashboard/estates');
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
router.post('/add-file', ensureAuthenticated, upload.fields(uploadFields), (req, res, next) => {
    var body = req.body;
    var files = req.files;
    var numberOfImages = req.body.numberOfImages;
    body.creationDate = new Date();
    if(req.user.role == 'admin' || req.user.role == 'operator'){
        body.images = [];
        if(files) {
            var pathes = [];
            for (let i = 0; i < numberOfImages; i++) {
                var file = req.files[`file-${i}`];
                if(file){
                    file = file[0];
                    body.images.push({link: file.destination.slice(6) + '/' + file.originalname})
                    pathes.push(path.join(__dirname, '../public/', file.destination.slice(6) + '/' + file.originalname));
                }
            }
            pathes.forEach(p => {
                Jimp.read(p)
                    .then((tpl) => {
                        Jimp.read('./public/img/logo.png').then((logoTpl) => {
                            // logoTpl.opacity(0.5)
                            w = tpl.getWidth();
                            h = tpl.getHeight();
                            logoTpl.resize(w * 0.2, w * 0.2);
                            logoTpl.opacity(0.5);
                            return tpl.composite(logoTpl, 20, h-(w*0.2)-20, [Jimp.BLEND_DESTINATION_OVER])
                        })
                        .then((tpl) => {
                            tpl.write(p)
                            console.log(tpl);
                        })
                    })
            });
        }
        if(body.price) body.price = parseInt(body.price.replaceAll('.', ''));
        if(body.fullPrice) body.fullPrice = parseInt(body.fullPrice.replaceAll('.', ''));
        File.find({}, (err, files) => {
            var newFileNumber = 0;
            for(var i=0; i<files.length; i++){
                if(parseInt(files[i].fileNumber) > newFileNumber)
                    newFileNumber = parseInt(files[i].fileNumber);
            }
            body.fileNumber = newFileNumber+1;
            var newFile = new File(body);
            newFile.save().then(doc => {
                res.redirect('/dashboard/files');
            }).catch(err => console.log(err));
        });
    }
});
router.post('/edit-file', ensureAuthenticated, upload.fields(uploadFields), (req, res, next) => {
    var {fileID, numberOfImages} = req.body;
    var body = req.body;
    var files = req.files;
    body.creationDate = new Date();
    if(body.price) body.price = parseInt(body.price.replaceAll('.', ''));
    if(body.fullPrice) body.fullPrice = parseInt(body.fullPrice.replaceAll('.', ''));
    if(req.user.role == 'admin' || req.user.role == 'operator'){
        File.findById(fileID, (err, f) => {
            body.images = f.images;
            if(files) {
                var pathes = [];
                for (let i = 0; i < numberOfImages; i++) {
                    var file = req.files[`file-${i}`];
                    if(file) {
                        file = file[0];
                        body.images.push({link: file.destination.slice(6) + '/' + file.originalname})
                        pathes.push(path.join(__dirname, '../public/', file.destination.slice(6) + '/' + file.originalname));
                    }
                }
                pathes.forEach(p => {
                    Jimp.read(p)
                        .then((tpl) => {
                            Jimp.read('./public/img/logo.png').then((logoTpl) => {
                                // logoTpl.opacity(0.5)
                                w = tpl.getWidth();
                                h = tpl.getHeight();
                                logoTpl.resize(w * 0.2, w * 0.2);
                                logoTpl.opacity(0.8);
                                return tpl.composite(logoTpl, 20, h-(w*0.2)-20, [Jimp.BLEND_DESTINATION_OVER])
                            })
                            .then((tpl) => tpl.write(p))
                        })
                });
            }
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
    var {fullname, idNumber, password, addFilePermission, removeFilePermission, editFilePermission, 
        addEstatePermission, removeEstatePermission, editEstatePermission,notifPermission,
        settingsPermission} = req.body;
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
    if(notifPermission)        notifPermission = true;
    else                       notifPermission = false;
    if(settingsPermission)     settingsPermission = true;
    else                       settingsPermission = false;
    
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
                notifPermission,
                settingsPermission,
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
router.post('/add-operator', ensureAuthenticated, (req, res, next) => {
    var {fullname, idNumber, password} = req.body;
    User.findOne({idNumber}, (err, user) => {
        if(user){
            req.flash('error_msg', 'شماره تلفن قبلا ثبت شده');
            res.redirect('/dashboard/users');
        }else{
            var newUser = new User({
                fullname, 
                idNumber, 
                password,
                role: 'operator',
            });
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.save().then(doc => {
                    req.flash('success_msg', 'کاربر با موفقیت افزوده شد');
                    res.redirect('/dashboard/users');
                }).catch(err => console.log(err));
            }));
        }
    });
});
router.post('/edit-user', ensureAuthenticated, (req, res, next) => {
    var {fullname, idNumber, password, addFilePermission, removeFilePermission, editFilePermission, addEstatePermission, removeEstatePermission, editEstatePermission, notifPermission, settingsPermission} = req.body;
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
    if(notifPermission)        notifPermission = true;
    else                       notifPermission = false;
    if(settingsPermission)     settingsPermission = true;
    else                       settingsPermission = false;
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
        if(password && password != '') password = hash;
        User.updateMany({idNumber}, {$set: {
            fullname, 
            idNumber, 
            password, 
            addFilePermission, 
            removeFilePermission, 
            editFilePermission, 
            addEstatePermission, 
            removeEstatePermission, 
            editEstatePermission,
            notifPermission,
            settingsPermission,
            role: 'admin',
        }},(err) => {
            if(err) console.log(err);
            req.flash('success_msg', 'تغییرات با موفقیت ثبت شد');
            res.redirect('/dashboard/users');
        })
    }));
    
});
router.post('/upload-excel', ensureAuthenticated, upload.single('excelFile'), (req, res, next) => {
    var file = req.file, filePath;
    var removeAll = req.body.removeAll;
    if(removeAll){
        File.deleteMany({}, (err)=> {
            if(file) {
                filePath = file.destination.slice(6) + '/' + file.originalname
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
            }
            res.redirect('/dashboard/files');
        })
    }
    else{
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
                constPhone: typeof(excelFile.Sheets[sheets[i]].L2) == 'undefined' ? '' : excelFile.Sheets[sheets[i]].L2.v,
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
    }
    
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
router.post('/download-excel', ensureAuthenticated, (req, res, next) => {
    var {startDay, startMonth, startYear, endDay, endMonth, endYear} = req.body;
    var startDate = parseInt(startYear)*365 + parseInt(startMonth)*30 + parseInt(startDay);
    var endDate = parseInt(endYear)*365 + parseInt(endMonth)*30 + parseInt(endDay);
    var workbook = new excel.Workbook({
        dateFormat: 'm/d/yy hh:mm:ss'
    });
    var style = workbook.createStyle({
        font: {
        color: '#111111',
        size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });
    File.find({}, (err, files) => {
        var result = [];
        for (let i = 0; i < files.length; i++) {
            var d = files[i].date.split('/');
            if(d && d.length == 3){
                var fileDate = parseInt(d[0])*365 + parseInt(d[1])*30 + parseInt(d[2]);
                if(fileDate <= endDate && fileDate >= startDate){
                    result.push(files[i]);
                    var worksheet = workbook.addWorksheet(files[i].fileNumber);
                    worksheet.cell(2 , 2 ).string(typeof(files[i].date) == 'undefined' || files[i].date == null? '': files[i].date.toString()).style(style);
                    worksheet.cell(4 , 2 ).string(typeof(files[i].fileNumber) == 'undefined' || files[i].fileNumber == null? '': files[i].fileNumber.toString()).style(style);
                    worksheet.cell(6 , 2 ).string(typeof(files[i].role) == 'undefined' || files[i].role == null? '': files[i].role.toString()).style(style);
                    worksheet.cell(2 , 4 ).string(typeof(files[i].phone) == 'undefined' || files[i].phone == null? '': files[i].phone.toString()).style(style);
                    worksheet.cell(4 , 4 ).string(typeof(files[i].type) == 'undefined' || files[i].type == null? '': files[i].type.toString()).style(style);
                    worksheet.cell(6 , 4 ).string(typeof(files[i].state) == 'undefined' || files[i].state == null? '': files[i].state.toString()).style(style);
                    worksheet.cell(2 , 12).string(typeof(files[i].constPhone) == 'undefined' || files[i].constPhone == null? '': files[i].constPhone.toString()).style(style);
                    worksheet.cell(2 , 19).string(typeof(files[i].ownerName) == 'undefined' || files[i].ownerName == null? '': files[i].ownerName.toString()).style(style);
                    worksheet.cell(4 , 12).string(typeof(files[i].address) == 'undefined' || files[i].address == null? '': files[i].address.toString()).style(style);
                    worksheet.cell(12, 2 ).string(typeof(files[i].options) == 'undefined' || files[i].options == null? '': files[i].options.toString()).style(style);
                    worksheet.cell(14, 13).string(typeof(files[i].price) == 'undefined' || files[i].price == null? '': files[i].price.toString()).style(style);
                    worksheet.cell(14, 2 ).string(typeof(files[i].fullPrice) == 'undefined' || files[i].fullPrice == null? '': files[i].fullPrice.toString()).style(style);
                    worksheet.cell(16, 27).string(typeof(files[i].lone) == 'undefined' || files[i].lone == null? '': files[i].lone.toString()).style(style);
                    worksheet.cell(16, 22).string(typeof(files[i].changable) == 'undefined' || files[i].changable == null? '': files[i].changable.toString()).style(style);
                    worksheet.cell(16, 19).string(typeof(files[i].discount) == 'undefined' || files[i].discount == null? '': files[i].discount.toString()).style(style);
                    worksheet.cell(16, 15).string(typeof(files[i].documentState) == 'undefined' || files[i].documentState == null? '': files[i].documentState.toString()).style(style);
                    worksheet.cell(16, 10).string(typeof(files[i].transfer) == 'undefined' || files[i].transfer == null? '': files[i].transfer.toString()).style(style);
                    worksheet.cell(16, 5 ).string(typeof(files[i].advertiser) == 'undefined' || files[i].advertiser == null? '': files[i].advertiser.toString()).style(style);
                    worksheet.cell(9 , 2 ).string(typeof(files[i].heatingAndCoolingSystem) == 'undefined' || files[i].heatingAndCoolingSystem == null? '': files[i].heatingAndCoolingSystem.toString()).style(style);
                    worksheet.cell(10, 2 ).string(typeof(files[i].heatingAndCoolingSystem2) == 'undefined' || files[i].heatingAndCoolingSystem2 == null? '': files[i].heatingAndCoolingSystem2.toString()).style(style);
                    worksheet.cell(11, 2 ).string(typeof(files[i].heatingAndCoolingSystem3) == 'undefined' || files[i].heatingAndCoolingSystem3 == null? '': files[i].heatingAndCoolingSystem3.toString()).style(style);
                    worksheet.cell(9 , 3 ).string(typeof(files[i].service) == 'undefined' || files[i].service == null? '': files[i].service.toString()).style(style);
                    worksheet.cell(10, 3 ).string(typeof(files[i].service2) == 'undefined' || files[i].service2 == null? '': files[i].service2.toString()).style(style);
                    worksheet.cell(11, 3 ).string(typeof(files[i].service3) == 'undefined' || files[i].service3 == null? '': files[i].service3.toString()).style(style);
                    worksheet.cell(9 , 4 ).string(typeof(files[i].floortype) == 'undefined' || files[i].floortype == null? '': files[i].floortype.toString()).style(style);
                    worksheet.cell(10, 4 ).string(typeof(files[i].floortype2) == 'undefined' || files[i].floortype2 == null? '': files[i].floortype2.toString()).style(style);
                    worksheet.cell(11, 4 ).string(typeof(files[i].floortype3) == 'undefined' || files[i].floortype3 == null? '': files[i].floortype3.toString()).style(style);
                    worksheet.cell(9 , 7 ).string(typeof(files[i].view) == 'undefined' || files[i].view == null? '': files[i].view.toString()).style(style);
                    worksheet.cell(10, 7 ).string(typeof(files[i].view2) == 'undefined' || files[i].view2 == null? '': files[i].view2.toString()).style(style);
                    worksheet.cell(11, 7 ).string(typeof(files[i].view3) == 'undefined' || files[i].view3 == null? '': files[i].view3.toString()).style(style);
                    worksheet.cell(9 , 8 ).string(typeof(files[i].kitchen) == 'undefined' || files[i].kitchen == null? '': files[i].kitchen.toString()).style(style);
                    worksheet.cell(10, 8 ).string(typeof(files[i].kitchen2) == 'undefined' || files[i].kitchen2 == null? '': files[i].kitchen2.toString()).style(style);
                    worksheet.cell(11, 8 ).string(typeof(files[i].kitchen3) == 'undefined' || files[i].kitchen3 == null? '': files[i].kitchen3.toString()).style(style);
                    worksheet.cell(9 , 11).string(typeof(files[i].elevator) == 'undefined' || files[i].elevator == null? '': files[i].elevator.toString()).style(style);
                    worksheet.cell(10, 11).string(typeof(files[i].elevator2) == 'undefined' || files[i].elevator2 == null? '': files[i].elevator2.toString()).style(style);
                    worksheet.cell(11, 11).string(typeof(files[i].elevator3) == 'undefined' || files[i].elevator3 == null? '': files[i].elevator3.toString()).style(style);
                    worksheet.cell(9 , 14).string(typeof(files[i].warehouse) == 'undefined' || files[i].warehouse == null? '': files[i].warehouse.toString()).style(style);
                    worksheet.cell(10, 14).string(typeof(files[i].warehouse2) == 'undefined' || files[i].warehouse2 == null? '': files[i].warehouse2.toString()).style(style);
                    worksheet.cell(11, 14).string(typeof(files[i].warehouse3) == 'undefined' || files[i].warehouse3 == null? '': files[i].warehouse3.toString()).style(style);
                    worksheet.cell(9 , 16).string(typeof(files[i].parking) == 'undefined' || files[i].parking == null? '': files[i].parking.toString()).style(style);
                    worksheet.cell(10, 16).string(typeof(files[i].parking2) == 'undefined' || files[i].parking2 == null? '': files[i].parking2.toString()).style(style);
                    worksheet.cell(11, 16).string(typeof(files[i].parking3) == 'undefined' || files[i].parking3 == null? '': files[i].parking3.toString()).style(style);
                    worksheet.cell(9 , 18).string(typeof(files[i].buildAge) == 'undefined' || files[i].buildAge == null? '': files[i].buildAge.toString()).style(style);
                    worksheet.cell(10, 18).string(typeof(files[i].buildAge2) == 'undefined' || files[i].buildAge2 == null? '': files[i].buildAge2.toString()).style(style);
                    worksheet.cell(11, 18).string(typeof(files[i].buildAge3) == 'undefined' || files[i].buildAge3 == null? '': files[i].buildAge3.toString()).style(style);
                    worksheet.cell(9 , 20).string(typeof(files[i].unit) == 'undefined' || files[i].unit == null? '': files[i].unit.toString()).style(style);
                    worksheet.cell(10, 20).string(typeof(files[i].unit2) == 'undefined' || files[i].unit2 == null? '': files[i].unit2.toString()).style(style);
                    worksheet.cell(11, 20).string(typeof(files[i].unit3) == 'undefined' || files[i].unit3 == null? '': files[i].unit3.toString()).style(style);
                    worksheet.cell(9 , 21).string(typeof(files[i].numOfFloors) == 'undefined' || files[i].numOfFloors == null? '': files[i].numOfFloors.toString()).style(style);
                    worksheet.cell(10, 21).string(typeof(files[i].numOfFloors2) == 'undefined' || files[i].numOfFloors2 == null? '': files[i].numOfFloors2.toString()).style(style);
                    worksheet.cell(11, 21).string(typeof(files[i].numOfFloors3) == 'undefined' || files[i].numOfFloors3 == null? '': files[i].numOfFloors3.toString()).style(style);
                    worksheet.cell(9 , 23).string(typeof(files[i].floor) == 'undefined' || files[i].floor == null? '': files[i].floor.toString()).style(style);
                    worksheet.cell(10, 23).string(typeof(files[i].floor2) == 'undefined' || files[i].floor2 == null? '': files[i].floor2.toString()).style(style);
                    worksheet.cell(11, 23).string(typeof(files[i].floor3) == 'undefined' || files[i].floor3 == null? '': files[i].floor3.toString()).style(style);
                    worksheet.cell(9 , 24).string(typeof(files[i].bedroom) == 'undefined' || files[i].bedroom == null? '': files[i].bedroom.toString()).style(style);
                    worksheet.cell(10, 24).string(typeof(files[i].bedroom2) == 'undefined' || files[i].bedroom2 == null? '': files[i].bedroom2.toString()).style(style);
                    worksheet.cell(11, 24).string(typeof(files[i].bedroom3) == 'undefined' || files[i].bedroom3 == null? '': files[i].bedroom3.toString()).style(style);
                    worksheet.cell(9 , 27).string(typeof(files[i].meterage) == 'undefined' || files[i].meterage == null? '': files[i].meterage.toString()).style(style);
                    worksheet.cell(10, 27).string(typeof(files[i].meterage2) == 'undefined' || files[i].meterage2 == null? '': files[i].meterage2.toString()).style(style);
                    worksheet.cell(11, 27).string(typeof(files[i].meterage3) == 'undefined' || files[i].meterage3 == null? '': files[i].meterage3.toString()).style(style);
                }
            }
        }
        workbook.write(`./public/files/backup.xlsx`, (err, stats) => {
            if(err) res.send(err);
            else res.sendFile(path.join(__dirname, '../public/files/backup.xlsx'));
        });

    });
});
router.get('/start-trial', ensureAuthenticated, (req, res, next) => {
    var {estateID} = req.query;
    Estate.updateMany({_id: estateID}, {$set: {planType: 'trial', payed: true, payDate: new Date()}}, (err, doc) => {
        req.flash('3 روز اشتراک رایگان فعال شد.');
        res.redirect('/dashboard/estates');
    });
});
router.get('/notif', ensureAuthenticated, (req, res, next) => {
    Notif.find({}, (err, notifs) => {
        News.find({}, (err, news) => {
            res.render('./dashboard/admin-notif', {
                user: req.user,
                notifs,
                news,
                convertDate
            })
        })
    })
});
router.get('/change-plan', ensureAuthenticated, (req, res, next) => {
    var {estateID, planType} = req.query;
    Estate.updateMany({_id: estateID}, {$set: {payed: true, payDate: new Date(), authority: '', planType: planType}}, (err, doc) => {
        res.redirect('/dashboard/estates');
    });
});
router.get('/remove-plan', ensureAuthenticated, (req, res, next) => {
    var {estateID} = req.query;
    Estate.updateMany({_id: estateID}, {$set: {payed: false, planType: 'free'}}, (err, doc) => {
        res.redirect('/dashboard/estates');
    });
});
router.post('/add-news', ensureAuthenticated, (req, res, next) => {
    var {title, text} = req.body;
    var newNews = new News({title, text, date: new Date, seen: 0, seenBy: []});
    newNews.save().then(doc => {
        res.redirect('/dashboard/notif');
    }).catch(err => console.log(err));
});
router.get('/delete-news', ensureAuthenticated, (req, res, next) => {
    var {newsID} = req.query;
    News.deleteMany({_id: newsID}, (err) => {
        res.redirect('/dashboard/notif');
    });
});
router.get('/delete-image', ensureAuthenticated, (req, res, next) => {
    var {fileID, index} = req.query;
    File.findById(fileID, (err, file) => {
        file.images.splice(index, 1);
        File.updateMany({_id: fileID}, {$set: file}, (err) => {
            res.redirect('/dashboard/files');
        })
    })
});
router.get('/notif-seen', ensureAuthenticated, (req, res, next) => {
    var {notifID} = req.query;
    Notif.updateMany({_id: notifID}, {$set: {seen: true}}, (err, doc) => {
        res.redirect('/dashboard/notif');
    });
});
module.exports = router;
