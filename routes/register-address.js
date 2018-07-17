// Get Homepage

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

router.get('/register-address', ensureAuthenticated, function(req, res){
    res.render('index');
});

module.exports = router;