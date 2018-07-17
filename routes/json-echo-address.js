var express = require('express');
var router = express.Router();

// try http://localhost:3000/echo-address?address=a@a.com
router.get('/echo-address', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ address: req.query.address }));
});

module.exports = router;