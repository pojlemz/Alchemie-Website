// Get Homepage

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

router.get('/register-address', ensureAuthenticated, function(req, res){
    res.render('index');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;