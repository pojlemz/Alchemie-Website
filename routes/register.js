var express = require('express');
var router = express.Router();

// Register
router.get('/register', function(req, res){
    res.render('register');
});

module.exports = router;