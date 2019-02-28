var ethers = require('ethers');
// var utils = require('ethers').utils;

var provider = ethers.getDefaultProvider('ropsten');

var address = "0xB17fC44dD79D21Cd7F4D8c9686c98aE9039b3909";

provider.getBalance(address).then(function(balance) {
    // balance is a BigNumber (in wei); format is as a sting (in ether)
    var etherString = ethers.utils.formatEther(balance);
    console.log("Balance: " + etherString);
});