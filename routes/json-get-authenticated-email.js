var express = require('express'); // Express app
var router = express.Router(); // Express router

// try http://localhost:3000/get-authenticated-email
router.get('/get-authenticated-email', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ email: req.user.email }));
});

module.exports = router;