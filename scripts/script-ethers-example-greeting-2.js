var ethers = require('ethers');

var provider = new ethers.providers.JsonRpcProvider();

const metacoinArtifacts = require('../build/contracts/Example.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var contract = new ethers.Contract(address, abi, provider);

var callPromise = contract.functions.getLatestGreeting();
callPromise.then(function(value) {
    console.log('Value:');
    console.log(value);
}).catch(function(err){
    console.log(err);
});