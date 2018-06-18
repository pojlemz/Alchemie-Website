const sendMaximumSpendableIfThresholdReached = require('../server/send-maximum-spendable-if-threshold-reached');

module.exports = function handleFilledOrder(orderPromise, utxo) {
    // Trigger a 'Bitcoin Sell' order on the exchange to hedge against volatility.
    // Mint Shyft tokens on the Blockchain.
    // Make Bitcoin transaction and send most Bitcoin from BitGo wallet to exchange.
    sendMaximumSpendableIfThresholdReached();
}