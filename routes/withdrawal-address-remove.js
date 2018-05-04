const express = require('express');
const router = express.Router();
const WithdrawalAddress = require('../models/withdrawal-address');

// Get Homepage
router.get('/withdrawal-address-remove', ensureAuthenticated, function(req, res){
    const email = req.user.email;
    const response = res;
    const address = req.query.address;
    WithdrawalAddress.removeAddress(email, 'BTC', address, function (err, res) {
        response.send(JSON.stringify({
            "success": "Address removed successfully.",
            "address": address
        }));
    });
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