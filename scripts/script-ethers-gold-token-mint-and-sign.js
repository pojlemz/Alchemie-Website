// require('dotenv').config({path: '../.env'}); // This reads the .env file in the root directory of the project and uses its values.
//
// var network = providers.networks.ropsten;
// var provider = new providers.InfuraProvider(network, "KliH3fvXLthwPonWNfrh");
//
// var utils = require('ethers').utils;
// var contract = require("../server/gold-contract-as-minter");
//
// // var callPromise = contract.address; // getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// // var callPromise = contract.functions.getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// var arrayified = utils.toUtf8Bytes("Strawbert");
// // var callPromise = contract.functions.mintAndSign(arrayified, "0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// var callPromise = contract.functions.abba();
// callPromise.then(function(value) {
//     console.log('Single Return Value:' + value);
// }).catch(function(err){
//     console.log(err);
// });

var ethers = require('ethers');
var providers = require('ethers').providers;
var utils = require('ethers').utils;

var network = providers.networks.testnet;
var provider = new providers.JsonRpcProvider('http://localhost:8545', network);

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

provider.listAccounts().then(function(accounts) { // List accounts
    var signer = provider.getSigner(accounts[0]); // Set a variable to match the signer of the transaction.
    var contract = new ethers.Contract(address, abi, signer);
    var callPromise = contract.functions.mintAndSign(utils.toUtf8Bytes("dog"), "0xa20a3ea17ed3e1a16a42e8dc1f4419c587f8c59d");
    callPromise.then(function(value) {
        console.log('Single Return Value:' + JSON.stringify(value));
    }).catch(function(err){
        console.log(err);
    });
});