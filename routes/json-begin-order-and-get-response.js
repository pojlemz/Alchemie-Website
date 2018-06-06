const express = require('express');
const router = express.Router();

router.post('/begin-order-and-get-response', ensureAuthenticated, function(req, res) {
    // TODO: What type of response are we going to get from this call?
    // TODO: Send back a response with the expiry time of the prices
    const productAddress = req.body.productAddress;
    const prices = JSON.parse(req.body.prices);
    const quantities = JSON.parse(req.body.quantities);
    res.send({productAddress: productAddress, prices: prices, quantities: quantities})
});

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;