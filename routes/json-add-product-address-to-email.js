var express = require('express');
var router = express.Router();

var pgClient = require('../models/pg-client');
const web3Utils = require('web3-utils');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/add-owned-address-to-email?address=0x0000000000000000000000000000000000000000000000000
router.post('/add-product-address-to-email', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    if (web3Utils.isAddress(req.body.address)) {
        var response = res;
        // req.user.email
        // var query = "SELECT * FROM ownedaddress WHERE address=$1"; // business logic change - we are permitting addresses from one account
        var query = "SELECT * FROM ownedaddress WHERE address=$1 AND email=$2"; // business logic change - we are permitting addresses from one account
        var params = [req.body.address, req.user.email];
        // @TODO: Add functionality to limit number of addresses per user to 500
        pgClient.runQuery(query, params, function (err, res) {
            if (typeof(res) === undefined || res === null) {
                var query2 = "SELECT * FROM ownedaddress;";
                pgClient.runQueryMultiSelect(query2, [], function (err, res) {
                    if (res.length < 5) {
                        var query3 = "INSERT INTO ownedaddress(email, address) VALUES ($1, $2);";
                        pgClient.runQuery(query3, [req.user.email, req.body.address], function (err, res) {
                            response.setHeader('Content-Type', 'application/json');
                            response.send(JSON.stringify({
                                response: "success",
                                email: req.user.email,
                                address: req.body.address
                            }));
                        });
                    } else {
                        response.setHeader('Content-Type', 'application/json');
                        response.send(JSON.stringify({
                            response: "failure",
                            email: null,
                            address: null,
                            error: "This account has too many addresses"
                        }));
                    }
                    // Address is not taken so we register the address with the new user
                });
            } else {
                // Address is taken so we report that the address is already registered
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({response: "failure", email: null, address: null, error: "You have already added that address."}));
            }
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({response: "failure", email: null, address: null, error: "The address you are trying to add is not valid."}));
    };
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.send('You are not logged in.');
    }
}

module.exports = router;