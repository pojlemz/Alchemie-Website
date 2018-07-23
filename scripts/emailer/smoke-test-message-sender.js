var messageSender = require('../../server/emailer/message-sender.js');

describe('Test sending emails with Google API', function() {
    describe('Sample Message Test', function() {
        xit('Running a sample test to send an email', function(done) {
            messageSender('dan@blockunity.com', 'Sample Subject', 'Sample Body', done)
        });
    });
});