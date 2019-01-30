var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var GoldToken = artifacts.require("./GoldToken.sol");
var Example = artifacts.require("./Example.sol");
var WorkWithShyft = artifacts.require("./WorkWithShyft.sol")

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(GoldToken);
  deployer.deploy(Example);
  deployer.deploy(WorkWithShyft);
};
