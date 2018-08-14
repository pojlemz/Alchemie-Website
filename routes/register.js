var express = require('express'); // Express app
var router = express.Router(); // Express router

// Register
router.get('/register', function(req, res){
    res.render('register');
});

module.exports = router;