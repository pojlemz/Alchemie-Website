// @TODO: rewrite for postgres
// var assert = require('assert');
// var mongoose = require('mongoose');
// var PendingUser = require('../models/pg-pending-user');
// mlog = require('mocha-logger');
// generateRandomHash = require('../server/generate-random-hash');
// mongoose.connect('mongodb://localhost/alchemy');
//
// describe('getUserByHashKey test', function() {
//     it('Running a test which gets a pending user using the hash key assigned at registration', function(done) {
//         PendingUser.getUserByEmail("a@a.com", function(err, data){
//             mlog.log('Data: ', data);
//             if (data){
//                 mlog.log('Email: ', data.email);
//                 mlog.log('Password: ', data.password);
//                 mlog.log('Name: ', data.name);
//                 mlog.log('Key: ', data.key);
//             }
//             done();
//         });
//     });
// });