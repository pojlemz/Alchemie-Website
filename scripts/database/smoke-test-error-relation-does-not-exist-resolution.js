// https://stackoverflow.com/questions/19941922/error-relation-does-not-exist\
// 2nd answer

var assert = require('assert');
mlog = require('mocha-logger');

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';
const client = new pg.Client(connectionString);

describe('This is a test that will show all the tables that the postgreSQL instance is connected to.', function() {
    it('Running a test which prints the tables that "client" is connected to', function(done) {
        client.connect();
        client.query('SELECT * FROM pg_catalog.pg_tables', function(err, result) {
            console.log(result);
        });
    });
});