const express = require('express'); // Express app
const router = express.Router(); // Express router
const HasBeenKyced = require("../models/has-been-kyced");

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/dashboard', ensureAuthenticated, function(req, res){
    var response = res;
    HasBeenKyced.getHasBeenKycedByEmail( req.user.email, function(err, res) {
        if (res !== null && res.kyced) {
            response.render('dashboard'); // in case where kyc is completed but user finds this link anyways
        } else {
            response.redirect('/tell-us-who-you-are');
        }
    });
});

module.exports = router;