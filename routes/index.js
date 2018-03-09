var express = require('express');
var router = express.Router();
var requestIp = require('request-ip');

const csrf = require('../server/csrf');
const parseForm = require('../server/parse-form');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	// If address is not taken then add address to user's owned addresses and return positive result
	// If address is taken then report an error in the ajax call
	res.render('index');
    var clientIp = requestIp.getClientIp(req);
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