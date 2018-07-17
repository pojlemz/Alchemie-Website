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

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/webhook-approve-withdrawal', ensureAuthenticated, function(req, res){
    console.log("Request:");
    console.log(req);
    console.log("Result:")
    console.log(res);
});

module.exports = router;