var express = require('express'); // Express app
var router = express.Router(); // Express router

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/login');
});

module.exports = router;