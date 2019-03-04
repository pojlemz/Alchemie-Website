var express = require('express'); // Express app
var router = express.Router(); // Express router
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

const Price = require('../models/price');
const request = require('request');

const BitcoinSpent = require('../models/bitcoin-spent');
const RecoBalance = require('../models/reco-balance');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/get-reco-balance', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var response = res;
    RecoBalance.getRECOBalanceByEmail(req.user.email, function(err, res) {
        var recoBalance = 0;
        if (res !== null) { // If the table has an entry
            recoBalance = res.amount;
        }
        response.send({balance: recoBalance});
    });
});

module.exports = router;