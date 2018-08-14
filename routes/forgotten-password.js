var express = require('express'); // Express app
var router = express.Router(); // Express router
var passport = require('../server/passport'); // Set variable to the node module passport

const parseForm = require('../server/parse-form'); // Used to scan requests for valid CSRF tokens

// Login
// router.post('/login', function(req, res) {
//     passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true})
//     //res.redirect('/');
// });
router.post('/forgotten-password',parseForm,function(req, res) { // Route called when user makes a post request to get the page where they can report a forgotten password
    res.redirect('/forgotten-password'); // Redirect user to 'get' route
});

router.get('/forgotten-password', function(req, res){ // Route called when user makes a get request to get the page where they can report a forgotten password.
    res.render('forgotten-password', {}); // Render page where user can enter forgotten password
});

module.exports = router;