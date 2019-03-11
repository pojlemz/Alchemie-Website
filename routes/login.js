var express = require('express'); // Express app
var router = express.Router(); // Express router
var passport = require('../server/passport');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid


// Login
// router.post('/login', function(req, res) {
//     passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true})
//     //res.redirect('/');
// });
router.post('/login',parseForm,
    passport.authenticate('local', {successRedirect:'/',failureRedirect:'/login', failureFlash: 'Incorrect Username And Password Combination'}),
    function(req, res) {
        res.redirect('/browse-offers');
    }
    //res.redirect('/');
);

router.get('/login', function(req, res){
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