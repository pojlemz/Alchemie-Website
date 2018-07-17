var express = require('express');
var router = express.Router();

// try http://localhost:3000/get-authenticated-email
router.get('/get-authenticated-email', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ email: req.user.email }));
});

module.exports = router;