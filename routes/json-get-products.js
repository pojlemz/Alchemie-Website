var express = require('express'); // Express app
var router = express.Router(); // Express router
const products = require('../server/constants-products');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.post('/get-products', parseForm, ensureAuthenticated, function(req, res) {
    // Ensure user is authenticated.
    var response = res;
    response.setHeader('Content-Type', 'application/json');
    response.send(products);
});

module.exports = router;