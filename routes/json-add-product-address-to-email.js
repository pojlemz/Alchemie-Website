var express = require('express'); // Express app
var router = express.Router(); // Express router

var pgClient = require('../models/pg-client'); // client used for making calls to work directly with the Postgres database.
const web3Utils = require('web3-utils'); // Client used for various web3 utilities

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/add-owned-address-to-email?address=0x0000000000000000000000000000000000000000000000000
router.post('/add-product-address-to-email',parseForm, ensureAuthenticated, function(req, res){ // Route that lets you add a product address to a corresponding email
    // Ensure user is authenticated.
    if (web3Utils.isAddress(req.body.address)) { // If the address provided in the POST body is a valid web3 address
        var response = res; // Set this variable to equal the post response
        // req.user.email
        // var query = "SELECT * FROM ownedaddress WHERE address=$1"; // business logic change - we are permitting addresses from one account
        var query = "SELECT * FROM ownedaddress WHERE address=$1 AND email=$2"; // business logic change - we are permitting addresses from one account
        var params = [req.body.address, req.user.email]; // Set parameters to address in POST body and authenticated user's email
        // @TODO: Add functionality to limit number of addresses per user to 500
        pgClient.runQuery(query, params, function (err, res) { // Make call to database getting the owned addresses for the authenticated user
            if (typeof(res) === undefined || res === null) { // If the response from the Postgres database is that the address hasn't been added yet
                var query2 = "SELECT * FROM ownedaddress WHERE email=$1;"; // Query to select all owned addresses
                var params2 = [req.user.email]; // Set variable to array with single value containing email of authenticated user
                pgClient.runQueryMultiSelect(query2, [], function (err, res) { // Run query where we select all owned addresses for the authenticated user
                    if (res.length < 5) { // If there are less than 5 product addresses
                        var query3 = "INSERT INTO ownedaddress(email, address) VALUES ($1, $2);";  // Insert an owned address with email and entered address
                        pgClient.runQuery(query3, [req.user.email, req.body.address], function (err, res) { // Run the query against the database to insert the owned address
                            response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
                            response.send(JSON.stringify({ // Send stringified JSON back
                                response: "success", // report a success in the stringified JSON
                                email: req.user.email, // add the authenticated user's email to the response
                                address: req.body.address // add the given bitcoin address to the response
                            }));
                        });
                    } else { // If there are too many product addresses
                        response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
                        response.send(JSON.stringify({ // Send stringified JSON back
                            response: "failure", // Report a failure in the stringified JSON
                            email: null, // Don't include an email in the response
                            address: null,// Don't include a Bitcoin address in the response
                            error: "This account has too many addresses" // Include an error that proclaims too many Bitcoin addresses have been added
                        }));
                    }
                    // Address is not taken so we register the address with the new user
                });
            } else { // If the address has been added for this user
                // Address is taken so we report that the address is already registered
                response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
                response.send(JSON.stringify({response: "failure", email: null, address: null, error: "You have already added that address."})); // Send a failure JSON response informing the user that they have already added the address.
            }
        });
    } else { // If the address in the request body is a valid Ethereum address
        res.setHeader('Content-Type', 'application/json'); // Set the header of the response object
        res.send(JSON.stringify({response: "failure", email: null, address: null, error: "The address you are trying to add is not valid."})); // Send a failure JSON response telling them that the address provided is not valid
    };
});

module.exports = router;