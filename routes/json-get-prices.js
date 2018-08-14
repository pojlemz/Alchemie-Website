var express = require('express');
var router = express.Router();

const Price = require('../models/price');
var pgClient = require('../models/pg-client');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.post('/get-prices',parseForm, ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var response = res;
    Price.getLatestPricesInBitcoin(function(err, res){
        if (err) {
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({ response: 'error', prices: res }));
        } else {
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({response: 'success', prices: res}));
        }
    });
});

module.exports = router;