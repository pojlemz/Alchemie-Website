var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Ensure the 2FA server is running.
TwoFactorAuthenticator.verifyOneTimePasswordAndEmail('bob@saggot.com', '000000', function(err, body){
    console.log('Error: ', err);
    console.log('Body: ', body);
});