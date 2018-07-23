var assert = require('assert');
mlog = require('mocha-logger');

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';

const client = new pg.Client(connectionString);

describe('Just a simple test with a sample select statement', function() {
    it('Running a test which prints the results from a simple select statement', function(done) {
        client.connect();
        client.query('SELECT $1::text as message', ['Hello world!'], function(err, res) {
            mlog.log(err ? err.stack : res.rows[0].message); // Hello World!
            client.end();
            done();
        });
    });
});