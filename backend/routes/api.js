var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');

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
    var {username, password} = req.query;
    Estate.findOne({code: username, password: password}, (err, estate) => {
        if(estate){
            File.find({area: estate.area}, (err, files) => {
                res.send({status: 'ok', files});
            })
        }
        else res.send({status: 'error'})
    })
});

module.exports = router;
