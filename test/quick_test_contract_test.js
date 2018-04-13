const Web3 = require('web3');
const contract = require('truffle-contract');
const fs = require('fs');

const fileContents = fs.readFileSync('../build/contracts/MetaCoin.json', 'utf8');
const metacoinArtifacts = JSON.parse(fileContents);
const MetaCoin = contract(metacoinArtifacts);

var accounts;
var account;

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
MetaCoin.setProvider(web3.currentProvider);
if (typeof MetaCoin.currentProvider.sendAsync !== "function") {
    MetaCoin.currentProvider.sendAsync = function() {
        return MetaCoin.currentProvider.send.apply(
            MetaCoin.currentProvider, arguments
        );
    };
}

web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
        console.error("There was an error fetching your accounts.");
        return;
    }
    if (accs.length == 0) {
        console.error("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
    }
    accounts = accs;
    account = accounts[0];

    meta = MetaCoin.deployed().then(function(instance) {
        instance.getBalance.call(account, {from: account}).then(function(value) {
            console.log("Printing value: value of....");
            console.log(value.valueOf());
        });
    }).catch(function(e) {
        console.error(e);
    });
});