const OwnedAddress = require("../models/owned-address");
var express = require('express');
var router = express.Router();

var pgClient = require('../models/pg-client');

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/get-owned-addresses-by-email', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var response = res;
    OwnedAddress.getOwnedAddressByEmail(req.user.email, function(err, res) {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({ addresses: res }));
    });
});

module.exports = router;