// The following link explains how to set up a postgressql module properly for your server side
// https://stackoverflow.com/questions/8484404/what-is-the-proper-way-to-use-the-node-js-postgresql-module

const query = require('pg-query');
query.connectionParameters = 'postgres://user:password@host:5432/database';

//accepts optional array of values as 2nd parameter for parameterized queries
query('SELECT $1::text as name', ['brian'], function(err, rows, result) {

});