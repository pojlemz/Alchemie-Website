// A model that manages unspent transaction outputs.

var BitGoJS = require('bitgo');
var BitGoAddress = require('./bitgo-address');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const bitcoinNetwork = process.env.BITCOIN_NETWORK;

// bitcoinutxos
// address - text - the bitcoin address that owns the utxo
// hash - text - the unspent transaction output hash
// value - int - # of satoshis in this output
// status - text - Whether or not the unspent output has used in the system

var pgClient = require('./pg-client');

module.exports.insertNewUTXOAsUnassigned = function(unspent, address, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "INSERT INTO bitcoinutxos (address, hash, value, status) VALUES ($1, $2, $3, $4);";
    var params = [unspent['address'], unspent['id'], unspent['value'], "Unassigned"];
    pgClient.runQuery(query, params, function (err, res) {
        var query = "SELECT * FROM bitcoinutxos WHERE hash=$1;";
        var params = [unspent['id']];
        pgClient.runQuery(query, params, callback);
    });
}

module.exports.getUTXOByHash = function(hash, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM bitcoinutxos WHERE hash=$1;";
    var params = [hash];
    pgClient.runQuery(query, params, callback);
}

module.exports.updateUTXOListWithBitGoByEmail = function(email, callback){
    const self = this;
    BitGoAddress.getAddressByEmail(email, 'BTC', function(err, res){
        if (err) {
            console.error("Error when fetching address by email while updating UTXOs");
            callback(err, res);
        } else {
            self.updateUTXOListWithBitGoByAddress(res.address, callback);
        }
    });
}

module.exports.updateUTXOListWithBitGoByAddress = function(address, callback){
    const compareAddress = address;
    const self = this;
    bitgo.coin(bitcoinNetwork).wallets().get({ id: walletId }).then(function(wallet) {
        // TODO: handle errors here
        // print the wallets
        wallet.unspents().then(function (unspents) {
            // print unspents
            const filteredUnspents = unspents.unspents.filter(function (unspent) {
                return unspent['address'] === compareAddress;
            });
            self.updateUTXOList(filteredUnspents, callback)
        });
    });
}

module.exports.updateUTXOList = function(unspents, callback){
    const self = this;
    const totalUTXOs = unspents.length;
    var countUTXO = 0;
    for (var i = 0; i < totalUTXOs; i++){
        const unspent = unspents[i];
        self.getUTXOByHash(unspent['id'], function(err, res){
            // TODO: Handle errors here
            if (res === null){
                self.insertNewUTXOAsUnassigned(unspent, function(err, res){

                });
            }
            countUTXO++;
            if (countUTXO === totalUTXOs){
                callback();
            }
            // TODO: call callback if all calls are finished.
        })
    }
}
