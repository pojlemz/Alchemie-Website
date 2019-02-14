const express = require('express'); // Express app
const router = express.Router(); // Express router
const requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/tell-us-who-you-are', ensureAuthenticated, function(req, res){
    var response = res;
    HasBeenKyced.getHasBeenKycedByEmail( req.user.email, function(err, res) {
        if (res !== null && res.kyced) {
            response.redirect('/browse-offers'); // in case where kyc is completed but user finds this link anyways
        } else {
            response.render('tell-us-who-you-are');
        }
    });
});

module.exports = router;