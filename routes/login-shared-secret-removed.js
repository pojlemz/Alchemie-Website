var express = require('express');
var router = express.Router();
var passport = require('../server/passport');

router.post('/login-shared-secret-removed',
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
