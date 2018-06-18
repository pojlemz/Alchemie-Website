const sendMaximumSpendableIfThresholdReached = require('../server/send-maximum-spendable-if-threshold-reached');

const requestLoop = setInterval(function(){
    // console.log("Running 30 second interval.")
}, 1000 * 30);

module.exports = requestLoop;