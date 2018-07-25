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
    var callPromise = contract.functions.burnAndShip(utils.toUtf8Bytes("a@a.com"));
    callPromise.then(function(value) {
        console.log('Single Return Value:' + JSON.stringify(value));
    }).catch(function(err){
        console.log(err);
    });
});