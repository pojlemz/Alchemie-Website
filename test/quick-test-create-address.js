require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    // console.log(JSON.stringify(wallet));
    wallet.createAddress({chain: 0}).then(function(address) {
        // print new address
        console.dir(address);
    });
});

/*
{ id: '5b184c8322b08ed3032c587c731684d4',
  address: '2NCVP2VVQ4VWKq5n3xk3yCVRaaWJAsHQpRW',
  chain: 0,
  index: 22,
  coin: 'tbtc',
  wallet: '5ab2cda32dcbafe707ff865a642ea734',
  coinSpecific:
   { redeemScript: '522102f7a22d60de0be7ae7c430f3cb84e442c58bce2ec1ff53bf660f4f79592d397e021037134718c3e26bf5ba4c51b68f282a68ba25e2278c3bca2cc1e6c4a02abd168112102f02c2d4e0c515b2c61bfb32ca79f31d60285c6e7689c082436b6df0c5c94df9053ae' },
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