// m / purpose' / coin_type' / account' / change / address_index

var secrets = require("./../secrets.json");

var ethers = require('ethers');

var mnemonic = secrets.mnemonic; // "marble modify two slogan that salmon finger shield omit sight glance vintage";
var path = "m/44'/60'/0'/0/0";

var wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

console.log(wallet.address);