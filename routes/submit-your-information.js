const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

// Get Homepage
router.get('/submit-your-information', ensureAuthenticated, function(req, res){
    var response = res;
    HasBeenKyced.getHasBeenKycedByEmail( req.user.email, function(err, res) {
        if (res !== null && res.inreview) {
            response.redirect('/buy-tokens'); // in case where kyc is completed but user finds this link anyways
        } else {
            DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res) {
                if (res !== null && res.inreview) {
                    response.redirect('/buy-tokens'); // in case user presses back button
                } else {
                    response.render('submit-your-information');
                }
            });
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;