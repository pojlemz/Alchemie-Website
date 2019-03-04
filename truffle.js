var secrets = require("./secrets.json");
var HDWalletProvider = require("truffle-hdwallet-provider");
var Web3 = require('web3'); // Set variable to the web3 module
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 10000000,
            gasLimit: 26000000000
        },
        ropsten: {
            provider: new HDWalletProvider(secrets.mnemonic, "https://ropsten.infura.io/"),
            network_id: "*",
            gas: 1000000,
            gasLimit: 67000000,
            gasPrice: 20000000000
        },
        // network_id: 3,
        // host: "localhost",
        // port:  8545,
        // gas:   2900000
        mainnet: {
            provider: new HDWalletProvider(secrets.mnemonic, "https://mainnet.infura.io/"),
            network_id: 1,
            gas: 1000000,
            gasLimit: 67000000
        }
    },
    compilers: {
        solc: {
            version: "0.5.2"
        }
    }
};

// module.exports = {
//   networks: {
//     development: {
//       host: "localhost",
//       port: 8545,
//       network_id: "*" // Match any network id
//     },
//     ropsten: {
//         network_id: 3,
//         host: "localhost",
//         port: 8545,
//         gas: 2900000
//     }
//   },
//     rpc: {
//         host: 'localhost',
//         post:8080
//     }
// };
