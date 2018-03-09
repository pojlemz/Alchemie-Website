var assert = require('assert');
mlog = require('mocha-logger');

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';

const client = new pg.Client(connectionString);

describe('Just a simple test with a sample select statement', function() {
    it('Running a test which prints the results from a simple select statement', function(done) {
        client.connect();
        // INSERT INTO testtable VALUES(15, :'content');
        client.query("INSERT INTO pendingusers (email, password, name, key) VALUES ('a@a.com', 'b7b7b7b7','aaa', 'key');", [], function(err, res) {
            client.query('SELECT * FROM pendingusers;', [], function(err, res) {
                mlog.log(err ? err.stack : res.rows[0].email); // Hello World!
                client.end();
                done();
            });
        });
    });
});