var express = require('express');
var router = express.Router();
var requestIp = require('request-ip');
var HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

// Get Homepage
router.get('/information-is-in-review', ensureAuthenticated, function(req, res){
    const response = res;
    DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res){
        if (res !== null && res.inreview) {
            // Here we tell the user that their documents are being reviewed.
            response.render('information-is-in-review');
        } else {
            // Here we ask the user to upload a document along with their address.
            response.redirect('/submit-your-information');
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