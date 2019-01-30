var express = require('express'); // Express app
var router = express.Router(); // Express router

// Get Homepage
router.get('/properties', function(req, res){ // The route corresponding to the front page of the web portal
    res.render('properties', {});
});

module.exports = router;