// const express = require('express');
// const router = express.Router();
// const WithdrawalAddress = require('../models/withdrawal-address');
// const TwoFactorAuthenticator = require('../server/two-factor-authenticator');
//
// const validateAddress = require('../server/validate-address');
//
// // Get Homepage
// router.get('/withdrawal-address-add', ensureAuthenticated, function(req, res){
//     const email = req.user.email;
//     const response = res;
//     const address = req.query.address;
//     var code = req.query.code;
//     if (typeof(code) === 'undefined'){
//         code = '000000';
//     }
//     TwoFactorAuthenticator.verifyOneTimeCodeAndEmail(email, code, function(err, res) {
//         if (typeof(res) === 'undefined' || res === null){
//             // This case occurs when we forget to start the 2fa server.
//             response.send(JSON.stringify({"error": "The two factor authentication server is not running."}));
//         } else {
//             if (res) {
//                 WithdrawalAddress.getAddresses(email, 'BTC', function (err, res) {
//                     if (res.length >= 5) { // @TODO: Check that the number of addresses is less than five
//                         response.send(JSON.stringify({"error": "You have exceeded the maximum of 5 withdrawal addresses."}));
//                     } else if (!validateAddress(address, 'BTC')) {
//                         response.send(JSON.stringify({"error": "The address provided is not valid."}));
//                     } else {
//                         var hasDuplicate = false;
//                         for (var i = 0; i < res.length; i++) {
//                             if (address === res[i].address) {
//                                 hasDuplicate = true;
//                             }
//                         }
//                         if (hasDuplicate) {
//                             response.send(JSON.stringify({"error": "This address has already been added."}));
//                         } else {
//                             WithdrawalAddress.addAddress(email, 'BTC', address, function (err, res) {
//                                 response.send(JSON.stringify({
//                                     "success": "Address added successfully.",
//                                     "address": address
//                                 }));
//                             });
//                         }
//                     }
//                 });
//             } else {
//                 // This code should never run if the user uses the UI normally.
//                 response.send(JSON.stringify({"error": "The 2fa code entered is invalid."}));
//             }
//         }
//     });
// });
//
// function ensureAuthenticated(req, res, next){
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         //req.flash('error_msg','You are not logged in');
//         res.redirect('/login');
//     }
// }
//
// module.exports = router;