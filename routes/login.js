var express = require('express');
var router = express.Router();
var passport = require('../server/passport');

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// Login
// router.post('/login', function(req, res) {
//     passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true})
//     //res.redirect('/');
// });
router.post('/login',parseForm,
    passport.authenticate('local', {successRedirect:'/',failureRedirect:'/login', failureFlash: 'Incorrect Username And Password Combination'}),
    function(req, res) {
        res.redirect('/');
    }
    //res.redirect('/');
);

router.get('/login',csrfProtection, function(req, res){
    res.render('login');
});

module.exports = router;

// var express = require('express');
// var router = express.Router();
// var passport = require('../server/passport');
//
// // Login
// router.post('/login',
//     passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
//     function(req, res) {
//         res.redirect('/');
//     }
// );
//
// router.get('/login', function(req, res){
//     res.render('login');
// });
//
// module.exports = router;