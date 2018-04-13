const DillonGageBalanceInUsd = require('../models/dillon-gage-balance-in-usd');

describe('This just posts a balance difference to the table.', function() {
    it('Posting the balance difference.', function() {
        DillonGageBalanceInUsd.addBalanceDifference(-10.00);
    });
});