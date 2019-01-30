var express = require('express'); // Express app
var router = express.Router(); // Express router

// Get Homepage
router.get('/investors', function(req, res){ // The route corresponding to the front page of the web portal
    res.render('investors', {});
});

module.exports = router;