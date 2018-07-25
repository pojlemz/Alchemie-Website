const Wallet = require('ethereumjs-wallet');
// const address = Wallet.fromPrivateKey(Buffer.from("d4d5ba4ab78526b730d5be3d9fdfd56e9c8ea0e3465d3adfec8d115080b209e1", 'hex')).getAddress().toString('hex');
const address = Wallet.fromPrivateKey(Buffer.from("6b2f76b4d63de3e216c7199da6a10efc077e61d4d44feca3432a7ce56e7d3b4e", 'hex')).getAddress().toString('hex');
console.log(address);