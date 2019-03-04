var express = require('express'); // Express app
var router = express.Router(); // Express router
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

const Price = require('../models/price');
const request = require('request');

const BitcoinSpent = require('../models/bitcoin-spent');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/get-balance', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var webRequest = req;
    var address = webRequest.query.address; // '16Fg2yjwrbtC6fZp61EV9mNVKmwCzGasw5';
    var prefix = "";
    if (process.env.BITCOIN_NETWORK === 'tbtc'){
        prefix = 'https://testnet.blockchain.info';
    } else {
        prefix = 'https://blockchain.info';
    }
    var url = prefix + '/balance?active=' + address;
    var response = res;
    request({
        uri: url,
        method: ""
    }, function (error, res, body) {
        BitcoinSpent.getBitcoinSpentByEmail(req.user.email, function(err, res) {
            var amountSpent = 0;
            if (res !== null) { // If the table has an entry
                amountSpent = res.amount;
            }
            if (error) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({response: 'error', balance: null}));
            } else {
                try {
                    if (Object.keys(JSON.parse(body)).indexOf(address) > -1) {
                        var balance = JSON.parse(body)[address].final_balance - amountSpent * 100000000;
                    } else {
                        var balance = "None";
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({response: 'success', balance: balance}));
                } catch (error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        response: 'error',
                        balance: "there was some kind of error when parsing the JSON response"
                    }));
                }
            }
        });
    });
});

module.exports = router;