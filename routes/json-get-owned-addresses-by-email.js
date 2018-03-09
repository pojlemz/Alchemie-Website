var express = require('express');
var router = express.Router();

var pgClient = require('../models/pg-client');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/get-owned-addresses-by-email', ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var response = res;
    var query = "SELECT * FROM ownedaddress WHERE email=$1";
    var params = [req.user.email];
    pgClient.runQueryMultiSelect(query, params, function(err, res){
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({ addresses: res }));
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