const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

const WithdrawalAddress = require('../models/withdrawal-address');

const BitgoAddress = require('../models/bitgo-address');
const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');
// Get Homepage
router.get('/webhook-approve-withdrawal', ensureAuthenticated, function(req, res){
    console.log("Request:");
    console.log(req);
    console.log("Result:")
    console.log(res);
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