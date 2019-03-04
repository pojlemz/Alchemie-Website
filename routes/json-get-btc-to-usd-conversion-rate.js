var express = require('express'); // Express app
var router = express.Router(); // Express router
var getUSDToBTCConversionRate = require('../server/get-usd-to-btc-conversion-rate');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/get-btc-to-usd-conversion-rate', function(req, res){
    // Ensure user is authenticated.
    var response = res;
    getUSDToBTCConversionRate(function(rate) {
        response.setHeader('Content-Type', 'application/json');
        response.send({rate: rate});
    });
});

module.exports = router;