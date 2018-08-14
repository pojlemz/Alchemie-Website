var express = require('express'); // Express app
var router = express.Router(); // Express app

var pgClient = require('../models/pg-client'); // client used for making calls to work directly with the Postgres database.
var web3 = require('web3'); // Set variable to the web3 module

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/add-owned-address-to-email?address=0x0000000000000000000000000000000000000000000000000
router.post('/add-owned-address-to-email',parseForm, ensureAuthenticated, function(req, res){ // route that is run when POST request adds owned address to account
    // Ensure user is authenticated.
    // if (web3.utils.isAddress(req.query.address)) {
    var response = res; // Set variable to response object
    // req.user.email
    // var query = "SELECT * FROM ownedaddress WHERE address=$1"; // business logic change - we are permitting addresses from one account
    var query = "SELECT * FROM ownedaddress WHERE address=$1 AND email=$2"; // business logic change - we are permitting addresses from one account
    var params = [req.query.address, req.user.email]; // Set variable to address parameter of request body and email of authenticated user
    // @TODO: Add functionality to limit number of addresses per user to 500
    pgClient.runQuery(query, params, function (err, res) { // Make call to database getting the owned addresses for the authenticated user
        if (typeof(res) === undefined || res === null) { // If the response from the Postgres database is that the address hasn't been added yet
            var query2 = "SELECT * FROM ownedaddress WHERE email=$1;"; // Query to select all owned addresses
            var params2 = [req.user.email]; // Set variable to array with single value containing email of authenticated user
            pgClient.runQueryMultiSelect(query2, params2, function (err, res) { // Run query where we select all owned addresses for the authenticated user
                if (res.length < 500) { // If there are less than 500 owned addresses
                    var query3 = "INSERT INTO ownedaddress(email, address) VALUES ('" + req.user.email + "', '" + req.query.address + "');"; // Insert an owned address with email and entered address
                    pgClient.runQuery(query3, [], function (err, res) { // Run the query against the database to insert the owned address
                        response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
                        response.send(JSON.stringify({ // Send stringified JSON back
                            response: "success", // report a success in the stringified JSON
                            email: req.user.email, // add the authenticated user's email to the response
                            address: req.query.address // add the given bitcoin address to the response
                        }));
                    });
                } else { // If there are too many owned addresses
                    response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
                    response.send(JSON.stringify({ // Send stringified JSON back
                        response: "failure", // Report a failure in the stringified JSON
                        email: null, // Don't include an email in the response
                        address: null, // Don't include a Bitcoin address in the response
                        error: "This account has too many addresses" // Include an error that proclaims too many Bitcoin addresses have been added
                    }));
                }
                // Address is not taken so we register the address with the new user
            });
        } else {
            // Address is taken so we report that the address is already registered
            response.setHeader('Content-Type', 'application/json'); // Set the header of the response object
            response.send(JSON.stringify({response: "failure", email: null, address: null, error: "You have already added that address."})); // Send a failure JSON response informing the user that they have already added the address.
        }
    });
    // } else {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify({response: "failure", email: null, address: null}));
    // }
});

module.exports = router;