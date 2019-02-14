var express = require('express'); // Express app
var router = express.Router(); // Express router
var requestIp = require('request-ip'); // library for checking the ip of the client's machine

const BitgoAddress = require('../models/bitgo-address'); // Set variable to equal Postgres table storing users' BitGo Addresses
const BitGoJS = require('bitgo'); // Set variable to be Bitgo node module

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN}); // Set variable to equal BitGo client used for making API requests
const walletId = process.env.WALLET_ID; // Set variable to equal wallet id
const coinType = process.env.BITCOIN_NETWORK; // Set variable to equal Bitcoin network ie. 'tbtc'

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

router.get('/', ensureAuthenticated, function(req, res){ // The route corresponding to the front page of the web portal
    res.redirect('/tell-us-who-you-are'); // Send user to a page where we tell them that their documents are being reviewed.
});

// Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){ // The route corresponding to the front page of the web portal
// 	// If address is not taken then add address to user's owned addresses and return positive result
// 	// If address is taken then report an error in the ajax call
//     const email = req.user.email; // Set variable equal to the email of the authenticated user
//     const response = res; // Set variable equal to the response that will be sent back to the user
//     BitgoAddress.getAddressByEmail(email, 'BTC', function(err, res){ // Using the Postgres BitgoAddress module
//         if (typeof(res) === 'undefined' || res === null){ // If a Bitcoin address has not been assigned for this user
//             // A bitcoin address has not been assigned for this user
//             bitgo.coin(coinType).wallets().get({ id: walletId}).then(function(wallet) { // Get the BitGo wallet and use it as a parameter in the callback
//                 wallet.createAddress({ label: email }).then(function(address) { // Create a new bitcoin address.
//                     // Store this bitcoin address
//                     const btcAddress = address.address; // Set variable to equal Bitcoin address that was just created
//                     // Now get the Address information
//                     bitgo.blockchain().getAddress({ address: btcAddress}, function(err, res) { // Bitgo client makes call to get info about bitcoin address
//                         if (err) { console.log(err); process.exit(-1); } // If there is an error then terminate this call
//                         console.log('Address info is: '); // Print a log message of the address info
//                         const btcSpendableBalance = Number(res.spendableBalance / 100000000).toFixed(8) + " BTC"; // Set variable to spendable balance in BTC
//                         const btcBalance = Number(res.balance / 100000000).toFixed(8) + " BTC"; // Set variable to balance in BTC
//                         BitgoAddress.setAddress(email, 'BTC', btcAddress, function(err, res){ // Set BitGo address for logged in user
//                             response.render('index', { // Show the index page of the web portal
//                                 'bitGoAddress': btcAddress, // Show the BitGo address in the webpage
//                                 'spendableBalance': btcSpendableBalance, // Show the spendable balance in the webpage
//                                 'balance': btcBalance // Show the balance in the webpage
//                             });
//                         });
//                     });
//                 });
//             });
//         } else { // If a Bitcoin address has been assigned for this user
//             const address = res.address; // Set variable to equal this user's BitGo address
//             bitgo.blockchain().getAddress({ address: address}, function(err, res) { // Bitgo client makes call to get info about bitcoin address
//                 if (err) { // If there is some kind of error reported by the API call
//                     console.log(err); // Print the error details
//                     console.error('Error connecting to bitGo'); // Print an error reporting that there was an error when connecting to BitGox
//                     // TODO: Render page and tell the user that the wallet is unavailable
//                     // TODO: Still let the user reach the dashboard but inform them that BitGo is unreachable
//                 } else { // If there was not some kind of error
//                     const btcSpendableBalance = Number(res.spendableBalance / 100000000).toFixed(8) + " BTC"; // Set spendable balance variable to equal spendable portion of API response
//                     const btcBalance = Number(res.balance / 100000000).toFixed(8) + " BTC"; // Set Bitcoin balance variable to equal Bitcoin balance of address
//                     response.render('index', { // Render the index webpage
//                         'bitGoAddress': address, // with the BitGo address as a string
//                         'spendableBalance': btcSpendableBalance, // with the spendable balance of the address
//                         'balance': btcBalance // with the balance of the address
//                     });
//                 }
//             });
//         }
//     })
// });

module.exports = router;