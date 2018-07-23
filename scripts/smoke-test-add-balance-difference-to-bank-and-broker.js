const BankAndBrokerBalanceInUsd = require('../models/bank-and-broker-balance-in-usd');

describe('This just posts a balance difference to the table.', function() {
    it('Posting the balance difference.', function() {
        BankAndBrokerBalanceInUsd.addBalanceDifference(100.00);
    });
});