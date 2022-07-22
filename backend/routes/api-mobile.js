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

module.exports = router;
