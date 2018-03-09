var express = require('express');
var router = express.Router();
var passport = require('../server/passport');

// Login
// router.post('/login', function(req, res) {
//     passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true})
//     //res.redirect('/');
// });
router.post('/forgotten-password',function(req, res) {
    res.redirect('/forgotten-password');
});

router.get('/forgotten-password', function(req, res){
    res.render('forgotten-password', {});
});

module.exports = router;