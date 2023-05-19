const RenewableEnergyExchange = artifacts.require("RenewableEnergyExchange");

contract("RenewableEnergyExchange", (accounts) => {
  it("should create and complete a energyContract", async () => {
    const instance = await RenewableEnergyExchange.deployed();
    const buyer = accounts[1];
    const seller = accounts[0];
    const energyAmount = 1000; // in kWh
    const price = web3.utils.toWei("1", "ether"); // in wei
    const duration = 60 * 60 * 24 * 30; // 30 days in seconds

    // Call the createContract function from the seller's account
    await instance.createEnergyContract(energyAmount, price, duration, {
      from: seller,
    });

    const energyContract = await instance.getEnergyContract(1);
    // log the energyContract
    console.log(energyContract);
    console.log(energyContract[7]);

    assert.equal(
      energyContract[1],
      "0x0000000000000000000000000000000000000000",
      "Buyer is incorrect"
    );
    assert.equal(energyContract[2], seller, "Seller is incorrect");
    assert.equal(
      energyContract[3].toNumber(),
      energyAmount,
      "Energy amount is incorrect"
    );
    assert.equal(energyContract[4].toString(), price, "Price is incorrect");
    assert.equal(
      energyContract[7],
      false,
      "EnergyContract should not be completed yet"
    );

    // Call the completeEnergyContract function from the buyer's account
    await instance.completeEnergyContract(1, { from: buyer, value: price });

    const completedEnergyContract = await instance.getEnergyContract(1);
    // log the completed energyContract
    console.log(completedEnergyContract);

    assert.equal(
      completedEnergyContract[7],
      true,
      "EnergyContract should be completed"
    );
  });
});
