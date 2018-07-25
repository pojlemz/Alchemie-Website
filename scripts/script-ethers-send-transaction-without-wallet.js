var ethers = require('ethers'); // Require the ethers library
var providers = require('ethers').providers; // Save a variable containing the ethers providers
// Corresponding address: "0x0feD8Ca4149e03AFfF07747e9A4c431929389e1E"
var network = providers.networks.testnet; // Set a network variable to correspond to local running testnet
var provider = new providers.JsonRpcProvider('http://localhost:8545', network); // Set a variable to correspond to local provider

var transaction = { // Create the content of the transaction here
    to: "0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C", // destination address for the transaction
    value: ethers.utils.parseEther("0.1") // Value to be sent
};

provider.listAccounts().then(function(accounts) { // List accounts
    var signer = provider.getSigner(accounts[0]); // Set a variable to match the signer of the transaction.
    console.log(signer);
    provider.getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C").then(function(balance) { // gets the ether balance at this account
        // balance is a BigNumber (in wei); format is as a sting (in ether)
        var etherString = ethers.utils.formatEther(balance); // string storing ether balance
        console.log("Balance: " + etherString); // Print the ether balance
        // Send the transaction
        var sendTransactionPromise = signer.sendTransaction(transaction); // Create the send transaction promise based on the transaction details
        sendTransactionPromise.then(function(transactionHash) { // Run transaction promise getting transaction hash
            console.log(transactionHash); // Print out the transaction hash
        }).catch(function(err){ // Catch any potential errors that may occur as a result in promise call
            console.log(err); // Print error to console
        });
    });
});