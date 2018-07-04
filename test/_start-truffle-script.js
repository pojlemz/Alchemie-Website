// var MetaCoin = artifacts.require("../build/contracts/MetaCoin.json");

contract('MetaCoin', function(accounts) {
        var meta;
        var metaCoinBalance;
        var metaCoinEthBalance;

        return MetaCoin.deployed().then(function(instance) {
            meta = instance;
            return meta.getBalance.call(accounts[0]);
        }).then(function(outCoinBalance) {
            metaCoinBalance = outCoinBalance.toNumber();
            return meta.getBalanceInEth.call(accounts[0]);
        }).then(function(outCoinBalanceEth) {
            metaCoinEthBalance = outCoinBalanceEth.toNumber();
        }).then(function() {
            assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
        });
});
