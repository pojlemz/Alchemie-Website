const OrderPromise = require('../models/order-promise'); // A node module corresponding to the Order Promise table
const OrderExecuted = require('../models/order-executed'); // A node module corresponding to the Order Executed table
const handleFilledOrder = require('../server/handle-filled-order'); // A function for handling filled orders

const request = require('request'); // A module for making post requests on the web
const host = process.env.DILLON_GAGE_API_ENDPOINT; // ie. "https://stage-connect.fiztrade.com"
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN; // ie. "1349-00bdbf2b582db69fb28b72a446cb6d18"
const gmailAddress = process.env.GMAIL_ADDRESS; // gmail address used for placing Dillon Gage orders

// These are the fields returned by the getOrderPromiseAndProductsByDepositAddress method.
// transactionid
// email
// cointype
// depositaddress
// productaddress
// expirymillisecondssinceunixepoch
// grandtotal
// status
// transactionoutput
// transactionid
// product
// qty
// priceid

module.exports = function handleConfirmedOrder(orderPromise, utxo, done) { // A function that is called when orders have been marked 'Confirmed'
    // This is where we try to fill the order with Dillon Gage.
    // If the order is filled then we move it's status to filled and it is labelled rejected otherwise.
    const depositAddress = orderPromise.depositaddress; // The address that the user pays to
    OrderPromise.getOrderPromiseAndProductsByDepositAddress(depositAddress, function(err, res){ // Use the deposit address to fetch order status / products
        // res should contain exactly one item
        var items = []; // Set items to empty array
        const transactionId = orderPromise.transactionid; // Set transactionid variable to match the unique transaction id which will be used in the API request ie. 17
        for (var i = 0; i < res.length; i++){ // Loop through the list of products corresponding to this transaction / product combo
            // Take the code from lock prices and order script and use it here
            items.push({"code":res[i].product,"transactionType":"buy","qty":res[i].qty.toFixed(0)}); // build items array with buy orders for each product in order
        }
        var url = host + '/FizServices/LockPrices/'+privateToken; // url for locking prices which must be done just before ordering
        request.post(url, // Make a post request with the designated url for locking prices
            {json: // data to be transmitted with post request
                {
                    "transactionId": transactionId.toFixed(0), // Include transactionid as string
                    "includeRetailPrices": "no", // Don't include retail prices in callback value (only include bid/ask)
                    "items": items // include items array that was built
                }
            }
            , function(error, response, body) { // Callback function that is triggered when prices are locked
                if (typeof(body) === 'undefined') { // If the body is undefined
                    console.error("Error when locking prices with Dillon Gage"); // Report an error that states there was a problem locking prices
                    console.log(error); // Report the details of the error
                    OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) { // Using the deposit address as a key, mark the order status to rejected
                        if (err) { // If there was an error given by Postgres
                            console.log(err); // Reports an error in case any have occurred.
                        }
                        console.log("This order has been set to 'Rejected'"); // State that the order has been marked as rejected
                        done(); // Release the asychronous locking mechanism
                    });
                } else if (body.error || error || response.statusCode === 500) { // If the response from Dillon Gage explicitly tells us that there is an error
                    console.error("Error when locking prices with Dillon Gage"); // Log the error on the server
                    console.log(error); // Report the details of the error
                    OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) { // Using the deposit address as a key, mark the order status to rejected
                        if (err) { // If there was an error given by Postgres
                            console.log(err); // Reports an error in case any have occurred.
                        }
                        console.log("This order has been set to 'Rejected'"); // State that the order has been marked as rejected
                        done(); // Release the asychronous locking mechanism
                    });
                } else {
                    console.log(body); // Print the body of the response from the locking request
                    const lockToken = body.lockToken; // Set variable to equal lock token from response
                    var url2 = host + '/FizServices/ExecuteTrade/' + privateToken; // Set url variable to url that will be called to formally execute the trade
                    // https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
                    /* "inventoryLocation":"DGI", */
                    request.post(url2, {json: // Send a Post request with the url corresponding to a trade execution
                        {
                            "transactionId":transactionId.toFixed(0), // ie. 17
                            "referenceNumber":transactionId.toFixed(0), // ie. 17
                            "shippingOption":"hold", // instructions to have product placed aside in a vault at the depository until we request it to be shipped
                            "lockToken":lockToken, // The lock token that we obtained from the locking request
                            "traderId":gmailAddress // The email address corresponding to the trader registered with Dillon Gage
                        }
                    }, function(error, response, body) { // A callback that is triggered when the order is placed
                        // Attempt to place the Dillon Gage order.
                        console.log("Printing response from order."); // Output to console stating that we will now print the response from the Dillon Gage order
                        if (typeof(body) === 'undefined') { // If the response from the server isn't defined
                            console.error("Error when getting body."); // Print a message on the server saying that an error occurred
                            console.log(error); // Print the actual error message that occurred.
                            if (err) { // If there was an error given by Postgres
                                console.log(err); // Reports an error in case any have occurred.
                            }
                            OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) { // Using the deposit address as a key, mark the order status to rejected
                                console.log("This order has been set to 'Rejected'"); // State that the order has been marked as rejected
                                done(); // Release the asychronous locking mechanism
                            });
                        } else { // If the response from the server happens to have a body
                            console.log(body); // Print the content of the response from Dillon Gage servers on this order
                            // TODO: Add all the order prices to the orderpromiselockedprices (without a callback counter preferably) for analytics purposes.
                            // Add the order to the table to record that an order that has been placed.
                            newOrderExecuted = {}; // Create an object for the next order to be executed
                            newOrderExecuted.transactionId = body.transactionId; // ie. 17
                            newOrderExecuted.inventoryLocation = body.inventoryLocation; // ie. "Vault"
                            newOrderExecuted.referenceNumber = body.referenceNumber; // ie. 17
                            newOrderExecuted.status = body.status; // ie. filled
                            newOrderExecuted.confirmationNumber = body.confirmationNumber[0]; // ie. 'FIZ00063897'
                            // Log the executed order into the table.
                            // TODO: Check if the order has been executed and if it has been then just carry on.
                            OrderExecuted.createOrderExecuted(newOrderExecuted, function(err, res) { // Create a record of the executed order in the database
                                // Change the order to 'Filled'
                                // TODO: handle error here.
                                OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Filled", function (err, res) { // Set the order status to filled using the deposit address
                                    // TODO: handle error here.
                                    // handle the filled order
                                    handleFilledOrder(orderPromise, utxo, done); // handle the filled order by passing it the order promise, utxo and asyncronous release callback 'done'
                                });
                            });
                        }
                    });
                }
            }
        );
    });
}