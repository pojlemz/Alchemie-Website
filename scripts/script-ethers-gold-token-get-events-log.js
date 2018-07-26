var ethers = require('ethers');
var providers = require('ethers').providers;
var utils = require('ethers').utils;

var network = providers.networks.testnet;
var provider = new providers.JsonRpcProvider('http://localhost:8545', network);
provider.resetEventsBlock(0);

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var filter = {
    address: address
//    topics: ["Ship"]
};

var callPromise = provider.getLogs(filter);

callPromise.then(function(result) {
    console.log(result);
}).catch(function(err){
    console.log(err);
});