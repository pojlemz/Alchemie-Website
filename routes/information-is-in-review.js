var express = require('express'); // Express app
var router = express.Router(); // Express app
var requestIp = require('request-ip'); // library for checking the ip of the client's machine
var HasBeenKyced = require("../models/has-been-kyced"); // Variable that corresponds to table recording if users have been Kyced
const DocumentInReview = require('../models/document-in-review'); // Variable that corresponds to table recording if users documents are currently under review

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/information-is-in-review', ensureAuthenticated, function(req, res){ // Get the page that tells the user their documents are currently being processed
    const response = res; // Set variable to response for get request
    DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res){ // Check if authenticated user's documents are being reviewed
        if (res !== null && res.inreview) { // If the documents are being reviewed
            // Here we tell the user that their documents are being reviewed.
            response.render('information-is-in-review'); // Show a splash page telling the user their documents are being reviewed
        } else {
            // Here we ask the user to upload a document along with their address.
            response.redirect('/submit-your-information'); // Redirect users to a page where they can submit their documents for review.
        }
    });
});

module.exports = router;