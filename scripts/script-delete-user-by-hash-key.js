// @TODO: rewrite for postgres
// var assert = require('assert');
// var mongoose = require('mongoose');
// var PendingUser = require('../models/pending-user');
// mlog = require('mocha-logger');
// generateRandomHash = require('../server/generate-random-hash');
// mongoose.connect('mongodb://localhost/alchemy');
//
// describe('deleteUserByHashKey test', function() {
//     it('Deletes a user according to a hash key', function(done) {
//         PendingUser.deleteUserByHashKey("bbbbdd2bb0358ac7dcb46e3a20d6c523bf38bbbb", function(err, data){
//             if (err) {
//                 mlog.log('Error: ', err);
//             } else {
//                 mlog.log('Data: ', data);
//             }
//             done();
//         })
//     });
// });