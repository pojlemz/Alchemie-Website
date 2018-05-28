var express = require('express');
var router = express.Router();

const Price = require('../models/price');
var pgClient = require('../models/pg-client');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.post('/get-prices', ensureAuthenticated, function(req, res){
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

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.send('You are not logged in.');
    }
}

module.exports = router;