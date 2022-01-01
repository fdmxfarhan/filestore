var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Estate = require('../models/Estate');
var File = require('../models/File');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('18286cd3-6065-4a7a-ad43-05eaf70f01a6', false);

// Docs: https://www.npmjs.com/package/zarinpal-checkout

router.get('/', (req, res, next) => {
    zarinpal.PaymentRequest({
        Amount: '1000', // In Tomans
        CallbackURL: 'https://filestore.ir/payment-call-back',
        Description: 'A Payment from Node.JS',
        Email: 'hi@siamak.work',
        Mobile: '09120000000'
      }).then(response => {
        if (response.status === 100) {
          res.redirect(response.url);
        }
      }).catch(err => {
        console.error(err);
      });
});


module.exports = router;
