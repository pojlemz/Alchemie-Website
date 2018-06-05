require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    console.log(JSON.stringify(wallet));
    wallet.createAddress({chain: 0}).then(function(address) {
        // print new address
        console.dir(address);
    });
});

/*
{"bitgo":{"user":null,"token":"v2xbad997fdce56b00f7eb23ad9a57287e2686f6282388afecbb6f59c164e395255","extensionKey":null},"_wallet":{"id":"5ab2cda32dcbafe707ff865a642ea734","users":[{"user":"5ab00d1a4a2ba3e507bda3d50b80ce2c","permissions":["admin","view","spend"]}],"coin":"tbtc","label":"Bargloves Wallet","m":2,"n":3,"keys":["5ab2cda22dcbafe707ff864e1ab643ff","5ab2cda29168ecee078e472a9f0d8bde","5ab2cda28d78816b07d7098317b9c13b"],"keySignatures":{},"tags":["5ab2cda32dcbafe707ff865a642ea734"],"disableTransactionNotifications":false,"freeze":{},"triggeredCircuitBreaker":false,"deleted":false,"approvalsRequired":1,"isCold":false,"coinSpecific":{},"admin":{"policy":{"id":"5ab2cda32dcbafe707ff865b9dec0143","label":"default","version":3,"date":"2018-05-17T15:27:46.814Z","mutableUpToDate":"2018-05-19T15:27:46.108Z","rules":[{"id":"2KAihv2ZyE9PcxRqdjLu44z9eZA5","coin":"tbtc","type":"velocityLimit","action":{"type":"getApproval","userIds":[]},"condition":{"amountString":"100000000","timeWindow":3600,"groupTags":[":tag"],"excludeTags":[]}},{"id":"2yTbAWePVPMmaF9A41dEioD1bbXd","coin":"tbtc","type":"velocityLimit","action":{"type":"getApproval","userIds":[]},"condition":{"amountString":"100000000","timeWindow":86400,"groupTags":[":tag"],"excludeTags":[]}},{"id":"3yCcai4P1pWihdpcQgc4BYmNwHyJ","coin":"tbtc","type":"velocityLimit","action":{"type":"getApproval","userIds":[]},"condition":{"amountString":"100000000","timeWindow":0,"groupTags":[":tag"],"excludeTags":[]}}]}},"clientFlags":[],"allowBackupKeySigning":false,"balance":31350527,"confirmedBalance":31350527,"spendableBalance":31350527,"balanceString":"31350527","confirmedBalanceString":"31350527","spendableBalanceString":"31350527","receiveAddress":{"id":"5b15b0d6b110364707f7c961c9dbe370","address":"2NDPjk26VCCpQkGfCVbtkC48euFjn1zWDeF","chain":0,"index":2,"coin":"tbtc","wallet":"5ab2cda32dcbafe707ff865a642ea734","coinSpecific":{"redeemScript":"522102a3966d6e0dee1d887def2ecd4b13c3c6586c0478e71b66ae257662ec4231231e21036402c01f815e22c2d307a3338cb7643c2a7c47edd643dcc8f0c0adc100e3edc42103477ce33ca0b5247a4bdee00b2e764bb57b4699ae7fee520802545e784418aed253ae"}},"pendingApprovals":[]}}
{ id: '5b1699bb5f3f8ebc0301ac6ec87901bc',
    address: '2N65JKxUzbY4fiML7aAZcSKPLwhEUgJqNEb',
    chain: 0,
    index: 3,
    coin: 'tbtc',
    wallet: '5ab2cda32dcbafe707ff865a642ea734',
    coinSpecific:
    { redeemScript: '5221024e11e2233ba01dc7940e5cb9fed244eb9889221a47d6f3b9f6ebece06a2af72621039703f3eeddc16c70bbaa097b7a142b94742d4c3da0f3997f8d0e59fa21ebc5fc2103c73ed3ffd55b28da339214f20a9665d0d6ff1e4e0202e46be6a649706167241a53ae' },
    keychains:
        [ { id: '5ab2cda22dcbafe707ff864e1ab643ff',
            users: [Array],
            pub: 'xpub661MyMwAqRbcFD3ruEQC8UvD77JoAQi772y8sGZhzgCF3gvbhyNKo1tVDykBRipGTYX9ve8o9ZHdXd1DkX5DYvNfS3wzhkKi7D1B7NWJXpQ',
            ethAddress: '0x93c88810312c7cefb4a65c32f4f7d88e4637ec40',
            encryptedPrv: '{"iv":"fEjVr0qi5Faine1S034t0g==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"G1o5ibyBF/A=","ct":"fiw5CFcPbDb5FTfp9agR11VrDBe6lYj7KiuQW9HeD744XatCAjOMppKgr80l70y27HwNFDGLxXbfe1prASFss6SZsYgv4w27X/Cm0rc81qXIQHkTaZZ/uaZJt8cSzx2dbn7/ghIEGoe+zNFIOwFsbyKdSxvRQ1Q="}' },
            { id: '5ab2cda29168ecee078e472a9f0d8bde',
                users: [Array],
                pub: 'xpub661MyMwAqRbcFugLik538AGFj3RmPZzxHJLPguhD2LKkhadcZoSodMvGjy3f2vh6NPZJX8zkjo5YFukLfPsbSKmY8DPfLvnkSBNoTSfR5z1',
                ethAddress: '0xf9b71a12b6f88ac0f23de9d01073fb2d357cbd76' },
            { id: '5ab2cda28d78816b07d7098317b9c13b',
                users: [Array],
                pub: 'xpub661MyMwAqRbcFo4yDGLwXJdTP9QnpXCxsehepdC5XwkHCwJpeEpdZoLE7vZYyHAFt4hAN31mzia2jEPLePCfvcBrVxfD4TufzNmPLRLqZin',
                ethAddress: '0x376f6fd0951452d7ddc02cff0ca40c06d7a98147',
                isBitGo: true } ] }
*/