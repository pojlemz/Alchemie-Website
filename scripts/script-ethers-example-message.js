var ethers = require('ethers');
var providers = require('ethers').providers;

var network = providers.networks.testnet;
var provider = new providers.JsonRpcProvider('http://localhost:8545', network);

const metacoinArtifacts = require('../build/contracts/Example.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var contract = new ethers.Contract(address, abi, provider);
var callPromise = contract.m_message();

callPromise.then(function(value) {
    console.log('Single Return Value:' + value);
}).catch(function(err){
    console.log(err);
});