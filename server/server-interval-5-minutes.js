const sendMaximumSpendableIfThresholdReached = require('../server/send-maximum-spendable-if-threshold-reached');

const requestLoop = setInterval(function(){
    sendMaximumSpendableIfThresholdReached();
}, 1000 * 60 * 5);

module.exports = requestLoop;