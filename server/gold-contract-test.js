var ethers = require('ethers');

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const address = metacoinArtifacts.networks[1].address;

var provider = new ethers.providers.JsonRpcProvider();
provider.getCode(address).then(function(code) {
    console.log("Code:", code);
});