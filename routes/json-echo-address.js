var express = require('express');
var router = express.Router();

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// try http://localhost:3000/echo-address?address=a@a.com
router.get('/echo-address', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ address: req.query.address }));
});

module.exports = router;