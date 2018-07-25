var ethers = require('ethers');
var providers = require('ethers').providers;

// var network = providers.networks.ropsten;
// var provider = new providers.InfuraProvider(network, "KliH3fvXLthwPonWNfrh");
var network = providers.networks.testnet;
var provider = new providers.JsonRpcProvider('http://localhost:8545', network);

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var contract = new ethers.Contract(address, abi, provider);

module.exports = contract;