var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res, next) => {
    // res.redirect('/users/login');
    res.render('home');
});

router.get('/privacy-policy', (req, res, next) => {
    res.render('privacy-policy');
});

module.exports = router;
