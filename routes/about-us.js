var express = require('express'); // Express app
var router = express.Router(); // Express router
var requestIp = require('request-ip'); // library for checking the ip of the client's machine

const BitgoAddress = require('../models/bitgo-address'); // Set variable to equal Postgres table storing users' BitGo Addresses
const BitGoJS = require('bitgo'); // Set variable to be Bitgo node module

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN}); // Set variable to equal BitGo client used for making API requests
const walletId = process.env.WALLET_ID; // Set variable to equal wallet id
const coinType = process.env.BITCOIN_NETWORK; // Set variable to equal Bitcoin network ie. 'tbtc'

// Get Homepage
router.get('/about-us', function(req, res){ // The route corresponding to the front page of the web portal
    res.render('about', {});
});

module.exports = router;