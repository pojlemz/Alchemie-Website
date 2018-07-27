var ethers = require('ethers');
var utils = require('ethers').utils;

var provider = new ethers.providers.JsonRpcProvider();

const metacoinArtifacts = require('../build/contracts/Example.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var signer = provider.getSigner();
var contract = new ethers.Contract(address, abi, signer);

//var callPromise = contract.functions.greet(utils.toUtf8Bytes("hello"));
var callPromise = contract.functions.greet("hello");
callPromise.then(function(txHash) {
    console.log(JSON.stringify(txHash));
}).catch(function(err){
    console.log(err);
});