var express = require('express'); // Express app
var router = express.Router(); // Express router

// try http://localhost:3000/echo-address?address=a@a.com
router.get('/echo-address', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ address: req.query.address }));
});

module.exports = router;