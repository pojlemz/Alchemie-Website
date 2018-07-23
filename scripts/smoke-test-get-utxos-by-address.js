require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const UTXO = require('../models/utxo');

mlog = require('mocha-logger');

describe('List the bitcoin UTXOs by a given address', function() {
    it('Running a test which shows the UTXOs for a given address', function(done) {
        UTXO.getUTXOsByAddress("2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", function(err, res){
            console.log(res);
            done();
        });
    });
});