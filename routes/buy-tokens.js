const express = require('express'); // Express app
const router = express.Router(); // Express router
var requestIp = require('request-ip'); // library for checking the ip of the client's machine
const HasBeenKyced = require("../models/has-been-kyced"); // Has been kyced Postgres model
const DocumentInReview = require('../models/document-in-review'); // Document in review postgres model
const BitgoAddress = require('../models/bitgo-address'); // Postgres model for Bitgo Addresses
const BitgoWallet = require('../models/bitgo-wallet'); //  Postgres model for BitGo wallet Ids (Deprecated since we only look at)
const BitGoJS = require('bitgo'); // SDK for interacting with BitGo services

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN}); // Set BitGo interface for the environment that we want
const walletId = process.env.WALLET_ID; // Id of Bitgo wallet
const coinType = process.env.BITCOIN_NETWORK; // string respresenting the bitcoin network that we are using ie. tbtc

const csrfProtection = require('../server/csrf-protection'); // CSRF protection module
const parseForm = require('../server/parse-form'); // Module for parsing html forms to search for CSRF tokens
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Get Homepage
router.get('/buy-tokens',  ensureAuthenticated,  function(req, res){ // Create route for 'get' request to buy tokens
    const response = res; // Set response to 'res' variable
    HasBeenKyced.getHasBeenKycedByEmail(req.user.email, function (err, res) { // Call database to see if user has been kyced
        if (res !== null && res.kyced) { // User has been successfully kyced so take them to the page where they select a coin
            preparePageToShowBitGoAddress(req, response); // Here we allow the user to start a purchase.
        } else { // User has not been successfully kyced so take them to the page where they upload their documents
            // Pane is available for user to upload document and document is shown below when this is done.
            // If document has already been uploaded then we notify the user.
            DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function (err, res) { // Call database to find out if current document is being reviewed
                if (res !== null && res.inreview) { // If the document is currently being reviewed
                    response.redirect('/information-is-in-review'); // Send user to a page where we tell them that their documents are being reviewed.
                } else {
                    response.redirect('/submit-your-information'); // Send user to a page where we ask the user to upload a document along with their address.
                }
            });
        }
    });
});

function preparePageToShowBitGoAddress(req, res) {
    const email = req.user.email; // Set variable to logged in user
    const response = res; // Set response to 'res' variable

    BitgoAddress.getAddressByEmail(email, 'BTC', function (err, res) { // Get BitGo address from table using email
        if (typeof(res) === 'undefined' || res === null) { // If the table has no corresponding Bitgo address
            bitgo.coin(coinType).wallets().get({id: walletId}).then(function (wallet) { // Get the BitGo wallet by API
                wallet.createAddress({label: email}).then(function (address) { // Create address from online BitGo wallet by API
                    const btcAddress = address.address; // Set variable to match address created
                    BitgoAddress.setAddress(email, '', btcAddress, function (err, res) { // In BitGo address table, set BitGo address
                        response.render('buy-bitgo-tokens-with-bitcoin', { // In UI, show page where we present the Bitcoin address to the user
                            'bitGoAddress': btcAddress // Include the Bitgo address in the javascript that fetches a QR code
                        });
                    });
                });
            });

        } else {
            const address = res.address; // Get the bitcoin address from the table
            response.render('buy-bitgo-tokens-with-bitcoin', { // Render the page with the Bitgo
                'bitGoAddress': address // Include the Bitgo address in the javascript that fetches a QR code
            });
        }
    });
}

module.exports = router; // Exporting router