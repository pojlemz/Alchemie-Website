const getChangeUtxos = require('../server/get-change-utxos');

module.exports = function moveChangeAndReadyUtxosToExchange() {
    getChangeUtxos(function(err, res) {

    });
}