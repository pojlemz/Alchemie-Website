const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');

// Get Homepage
router.get('/buy-tokens', ensureAuthenticated, function(req, res){
    const response = res;
    HasBeenKyced.getHasBeenKycedByEmail(req.user.email, function(err, res) {
        if (res !== null && res.kyced){ // User has been successfully kyced so take them to the page where they select a coin
            // Here we allow the user to start a purchase.
        } else { // User has not been successfully kyced so take them to the page where they upload their documents
            // Pane is available for user to upload document and document is shown below when this is done.
            // If document has already been uploaded then we notify the user.
            DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res){
                if (res !== null && res.inreview) {
                    // Here we tell the user that their documents are being reviewed.
                    response.redirect('/information-is-in-review');
                } else {
                    // Here we ask the user to upload a document along with their address.
                    response.redirect('/submit-your-information');
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