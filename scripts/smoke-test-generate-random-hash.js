var assert = require('assert');
mlog = require('mocha-logger');
generateRandomHash = require('../server/generate-random-hash');

describe('Random Hash test', function() {
    it('Running a test which generates a sample hash', function() {
        mlog.log('Printing random hash ', generateRandomHash());
    });
});