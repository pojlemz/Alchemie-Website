var express = require('express');
var router = express.Router();

var pgClient = require('../models/pg-client');
var web3 = require('web3');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/add-owned-address-to-email?address=0x0000000000000000000000000000000000000000000000000
router.get('/add-owned-address-to-email', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    if (web3.utils.isAddress(req.query.address)) {
        var response = res;
        // req.user.email
        // var query = "SELECT * FROM ownedaddress WHERE address=$1"; // business logic change - we are permitting addresses from one account
        var query = "SELECT * FROM ownedaddress WHERE address=$1 AND email=$2"; // business logic change - we are permitting addresses from one account
        var params = [req.query.address, req.user.email];
        // @TODO: Add functionality to limit number of addresses per user to 500
        pgClient.runQuery(query, params, function (err, res) {
            if (typeof(res) === undefined || res === null) {
                var query2 = "SELECT * FROM ownedaddress;";
                pgClient.runQueryMultiSelect(query2, [], function (err, res) {
                    if (res.length < 500) {
                        var query3 = "INSERT INTO ownedaddress(email, address) VALUES ('" + req.user.email + "', '" + req.query.address + "');";
                        pgClient.runQuery(query3, [], function (err, res) {
                            response.setHeader('Content-Type', 'application/json');
                            response.send(JSON.stringify({
                                response: "success",
                                email: req.user.email,
                                address: req.query.address
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
        res.send(JSON.stringify({response: "failure", email: null, address: null}));
    }
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.send('You are not logged in.');
    }
}

module.exports = router;