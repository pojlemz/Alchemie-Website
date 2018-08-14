var express = require('express'); // Express app
var router = express.Router(); // Express router
var passport = require('../server/passport');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid

router.post('/login-shared-secret-removed',parseForm,
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login-shared-secret-removed',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    }

);

router.get('/login-shared-secret-removed', function(req, res){
    req.flash('success_msg','Two factor authentication has been removed from your account.');
    res.redirect('/');
});

module.exports = router;
