var express = require('express');
var router = express.Router();
var passport = require('../server/passport');

const parseForm = require('../server/parse-form');

router.post('/login-shared-secret-set',parseForm,
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login-shared-secret-set',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    }

);

router.get('/login-shared-secret-set', function(req, res){
    req.flash('success_msg','Two factor authentication has been enabled for your account.');
    res.redirect('/');
});

module.exports = router;
