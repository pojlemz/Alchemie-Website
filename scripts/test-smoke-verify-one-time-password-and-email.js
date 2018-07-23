var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

mlog = require('mocha-logger');

// Ensure the 2FA server is running.
describe('Verify One time password and email authenticator check.', function() {
    it('Running a test which checks that a one time password and email are valid', function(done) {
        TwoFactorAuthenticator.verifyOneTimePasswordAndEmail('bob@saggot.com', '000000', function(err, body){
            mlog.log('Error: ', err);
            mlog.log('Body: ', body);
            done();
        });
    });
});