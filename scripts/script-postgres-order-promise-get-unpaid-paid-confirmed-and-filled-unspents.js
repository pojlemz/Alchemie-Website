require('dotenv').config({path: '../.env'});

const OrderPromise = require('../models/order-promise');

OrderPromise.getUnpaidPaidConfirmedAndFilledUnspents( function(err, res) {
    console.log(res);
});

// [ anonymous {
//     transactionid: 1,
//     email: 'dan@blockunity.com',
//     cointype: 'BTC',
//     depositaddress: '2N3nw9hpgxXwmDBYQkgEiVQ6S5EEwY43wMz',
//     productaddress: '0x2b5634c42055806a59e9107ed44d43c426e58258',
//     expirymillisecondssinceunixepoch: '1528923860897',
//     grandtotal: 0.9279776,
//     status: 'Unpaid',
//     transactionoutput: '' },
//     anonymous {
//     transactionid: 2,
//     email: 'dan@blockunity.com',
//     cointype: 'BTC',
//     depositaddress: '2N5ysnKbejQynX5YEzvWYmzQ57aE7ujb9XW',
//     productaddress: '0x2b5634c42055806a59e9107ed44d43c426e58258',
//     expirymillisecondssinceunixepoch: '1528924243447',
//     grandtotal: 0.9277664,
//     status: 'Unpaid',
//     transactionoutput: '' },