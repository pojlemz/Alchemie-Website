require('dotenv').config({path: '../.env'}); // This reads the .env file in the root directory of the project and uses its values.

var utils = require('ethers').utils;
var contract = require("../server/gold-contract-as-minter");

// var callPromise = contract.address; // getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// var callPromise = contract.functions.getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
var arrayified = utils.toUtf8Bytes("dog");
var callPromise = contract.functions.getSignedConfirmationNumber(arrayified);
callPromise.then(function(value) {
    console.log('Single Return Value:' + value);
}).catch(function(err){
    console.log(err);
});