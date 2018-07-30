var TwoFactorAuthenticator = require('../server/two-factor-authenticator');
const MintReady = require('../models/mint-ready');
const MintComplete = require('../models/mint-complete');

var ethers = require('ethers');
var provider = new ethers.providers.JsonRpcProvider();
var utils = require('ethers').utils;

const metacoinArtifacts = require('../build/contracts/GoldToken.json');
const abi = metacoinArtifacts.abi;
const address = metacoinArtifacts.networks[1].address;

var signer = provider.getSigner();
var contract = new ethers.Contract(address, abi, signer);

module.exports = function() {
    console.log("Processing mint ready transactions.");
    MintReady.getListOfMintReadys(function (err, res) {
        for (var i = 0; i < res.length; i++) {
            // Note: We assume that the product we are tracking is a kilogram gold bar.
            const mintReadyTx = res[i];
            const productAddress = mintReadyTx.productaddress;
            const confirmationNumber = mintReadyTx.confirmationnumber;
            var callPromise = contract.functions.mintAndSign(utils.toUtf8Bytes(confirmationNumber), productAddress);
            callPromise.then(function (txHash) {
                // This is where we send the transaction to the 2FA server for cosigning
                TwoFactorAuthenticator.mintAndCosign(confirmationNumber, function (err, res) {
                    if (err) {
                        console.error("Some kind of error occurred when attempting to cosign the transaction");
                    } else if (res === "failure") {
                        console.error("There was a failure on the server end when trying to cosign the transaction");
                    } else {
                        MintComplete.createMintComplete(mintReadyTx, function (err, res) {
                            MintReady.removeMintReady(mintReadyTx.transactionid, function (err, res) {
                                // The minting process should be complete at this point
                                console.log("Tokens minted.");
                            });
                        });
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
}