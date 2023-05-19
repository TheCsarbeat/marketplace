const RenewableEnergyExchange = artifacts.require("RenewableEnergyExchange");

module.exports = function(deployer) {
  deployer.deploy(RenewableEnergyExchange);
};
