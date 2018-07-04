// Follow https://medium.com/@guccimanepunk/how-to-deploy-a-truffle-contract-to-ropsten-e2fb817870c1

var ethers = require('ethers');

var provider = new ethers.providers.InfuraProvider("https://infuranet.infura.io/KliH3fvXLthwPonWNfrh", "KliH3fvXLthwPonWNfrh");

const metacoinArtifacts = require('../build/contracts/MetaCoin.json');

const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.bytecode;

var contract = new ethers.Contract(address, abi, provider);