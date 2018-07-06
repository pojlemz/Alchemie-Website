var express = require('express');
var router = express.Router();

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// try http://localhost:3000/get-authenticated-email
router.get('/get-authenticated-email', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ email: req.user.email }));
});

module.exports = router;