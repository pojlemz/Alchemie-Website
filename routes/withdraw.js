const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

const WithdrawalAddress = require('../models/withdrawal-address');

const BitgoAddress = require('../models/bitgo-address');
const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

// Get Homepage
router.get('/withdraw', ensureAuthenticated, function(req, res){
    const email = req.user.email;
    const response = res;
    WithdrawalAddress.getAddresses(email, 'BTC', function (err, res) {
        // var addresses = [];
        // for (var i = 0; i < res.length; i++) {
        //     addresses.push(res[i].address);
        // }
        response.render('withdraw', {'addresses': res});
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;