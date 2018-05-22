const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');
const WithdrawalAddress = require('../models/withdrawal-address');

const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

// Get Homepage
router.post('/submit-withdrawal', ensureAuthenticated, function(req, res){
    // const email = req.user.email; // bob@blockunity.com
    // const address = req.body.address; // "2MtaWaq1uH4HvukDbXi1irjnDthFcdpvVMG"
    // const amount = req.body.amount; // 0.01
    //
    // const response = res;
    // WithdrawalAddress.getAddresses(email, 'BTC', function (err, res) {
    //     // var addresses = [];
    //     // for (var i = 0; i < res.length; i++) {
    //     //     addresses.push(res[i].address);
    //     // }
    //     response.send(JSON.stringify({"error": "This address has already been added."}));
    // });

    res.render('withdraw');
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