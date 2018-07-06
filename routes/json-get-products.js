var express = require('express');
var router = express.Router();
const products = require('../server/constants-products');

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.post('/get-products',parseForm, ensureAuthenticated, function(req, res){
    // Ensure user is authenticated.
    var response = res;
    response.setHeader('Content-Type', 'application/json');
    response.send(products);
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.send('You are not logged in.');
    }
}

module.exports = router;