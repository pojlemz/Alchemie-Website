var express = require('express'); // Express app
var router = express.Router(); // Express router

// Get Homepage
router.get('/contact-us', function(req, res){ // The route corresponding to the front page of the web portal
    res.render('contact-us', {});
});

module.exports = router;