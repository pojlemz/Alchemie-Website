const express = require('express'); // Express app
const router = express.Router(); // Express router

// Get Homepage
router.get('/prunes', function(req, res){
    res.render('prunes');
});

module.exports = router;