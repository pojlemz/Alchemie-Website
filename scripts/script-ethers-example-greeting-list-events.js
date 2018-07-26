var ethers = require('ethers');

var provider = new ethers.providers.JsonRpcProvider();
const metacoinArtifacts = require('../build/contracts/Example.json');
const address = metacoinArtifacts.networks[1].address;

var filter = {
    address: address,
    fromBlock: 0
};
var callPromise = provider.getLogs(filter);
callPromise.then(function(events) {
    console.log("Printing array of events:");
    console.log(events);
}).catch(function(err){
    console.log(err);
});