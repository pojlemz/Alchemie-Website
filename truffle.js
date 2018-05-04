module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
        network_id: 3,
        host: "localhost",
        port: 8545,
        gas: 2900000
    }, mytestnetnode: {
          host: "localhost",
          network_id: "*", // any network associated with your node
          port: 30303,
          from: "77cf25001fdfb890e0ea4bc2747dcf85070656c4"
    }
  },
    rpc: {
        host: 'localhost',
        post:8080
    }
};
