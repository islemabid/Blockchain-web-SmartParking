const SmartParking = artifacts.require("./SmartParking.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartParking);
};
