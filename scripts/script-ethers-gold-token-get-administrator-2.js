var ethers = require('ethers');

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;
var provider = new ethers.providers.JsonRpcProvider();

var contract = new ethers.Contract(address, abi, provider);

var callPromise = contract.functions.getAdministrator();
callPromise.then(function(value) {
    console.log('Value:');
    console.log(value);
}).catch(function(err){
    console.log(err);
});