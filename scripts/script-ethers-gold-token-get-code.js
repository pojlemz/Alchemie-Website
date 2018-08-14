var ethers = require('ethers');
var provider = new ethers.providers.JsonRpcProvider();

const metacoinArtifacts = require('../build/contracts/Example.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

provider.getCode(address).then(function(code) {
    console.log("Code:", code);
});