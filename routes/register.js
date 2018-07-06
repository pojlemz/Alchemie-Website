var express = require('express');
var router = express.Router();

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// Register
router.get('/register', function(req, res){
    res.render('register');
});

module.exports = router;