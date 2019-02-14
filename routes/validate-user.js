const express = require('express'); // Express app
const router = express.Router(); // Express router
const HasBeenKyced = require("../models/has-been-kyced");

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/validate-user', ensureAuthenticated, function(req, res){
    var response = res;
    HasBeenKyced.setHasBeenKycedByEmail( req.user.email, true, function(err, res) {
        response.send('User validated');
    });
});

module.exports = router;