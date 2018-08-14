var express = require('express'); // Express app
var router = express.Router(); // Express router
var random2faKeyGenerator = require('../server/random-2fa-key-generator');
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');
var base32 = require('thirty-two');

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/two-factor-options', ensureAuthenticated, function(req, res){
    var response = res;
    TwoFactorAuthenticator.hasSharedSecret(req.user.email, function(err, res){
        // TODO: Branch in
        if (err){
            // Make sure that you have the 2fa program running or else you will encounter an error here.
            console.error(err);
            response.render('2fa-not-running', {err: err});
        }
        var outcome = res; // true or false
        if (!outcome) {
            // 2 factor has not been set up or has been removed.
            var key = random2faKeyGenerator.randomKey(10);
            var encodedKey = base32.encode(key);

            var otpUrl = 'otpauth://totp/Alchemie:' + req.user.email + '?secret=' + encodedKey + '&period=30';
            var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);

            response.render('add2fa', {user: req.user, key: encodedKey, qrImage: qrImage });
        } else {
            // 2 factor has already been set up.
            response.render('remove2fa', {err: err});
        }
    });
});

module.exports = router;