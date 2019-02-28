// What is the command line that gets executed here?

var ethers = require('ethers'); // Require the ethers library
var providers = require('ethers').providers; // Save a variable containing the ethers providers
const privateKey = "0x6b2f76b4d63de3e216c7199da6a10efc077e61d4d44feca3432a7ce56e7d3b4e"; // Private key
// Corresponding address: "0x0feD8Ca4149e03AFfF07747e9A4c431929389e1E"
var network = providers.networks.testnet; // Set a network variable to correspond to local running testnet
var provider = new providers.JsonRpcProvider('http://localhost:8545', network); // Set a variable to correspond to local provider

const wallet = new ethers.Wallet(privateKey); // Create an ethers wallet from the private key
wallet.provider = provider; // Set the provider for the wallet

var transaction = { // Create the content of the transaction here
    to: "0xa20a3ea17ed3e1a16a42e8dc1f4419c587f8c59d", // destination address for the transaction
    value: ethers.utils.parseEther("0.1") // Value to be sent
};

var estimateGasPromise = wallet.estimateGas(transaction); // Promise that displays price of gas that will be set for the transaction

provider.listAccounts().then(function(accounts) { // List accounts
    var signer = provider.getSigner(accounts[0]); // Set a variable to match the signer of the transaction.
    console.log(signer);
    provider.getBalance("0xa20a3ea17ed3e1a16a42e8dc1f4419c587f8c59d").then(function(balance) { // gets the ether balance at this account
        // balance is a BigNumber (in wei); format is as a sting (in ether)
        var etherString = ethers.utils.formatEther(balance); // string storing ether balance
        console.log("Balance: " + etherString); // Print the ether balance
        estimateGasPromise.then(function(gasEstimate) { // Get the gas limit
            console.log("Gas Estimate:"); // This line is for output cleanliness
            console.log(gasEstimate.toString()); // Convert this estimate to a string
            transaction.gasLimit = gasEstimate; // Add the gas limit to the transaction details
            // Send the transaction
            var sendTransactionPromise = signer.sendTransaction(transaction); // Create the send transaction promise based on the transaction details
            sendTransactionPromise.then(function(transactionHash) { // Run transaction promise getting transaction hash
                console.log(transactionHash); // Print out the transaction hash
            }).catch(function(err){ // Catch any potential errors that may occur as a result in promise call
                console.log(err); // Print error to console
            });
        });
    });
});