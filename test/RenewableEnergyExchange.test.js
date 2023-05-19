const RenewableEnergyExchange = artifacts.require("RenewableEnergyExchange");

contract("RenewableEnergyExchange", (accounts) => {
  it("should create and complete a transaction", async () => {
    const instance = await RenewableEnergyExchange.deployed();
    const buyer = accounts[1];
    const seller = accounts[0];
    const energyAmount = 1000; // in kWh
    const price = web3.utils.toWei("1", "ether"); // in wei
    const duration = 60 * 60 * 24 * 30; // 30 days in seconds

    // Call the createContract function from the seller's account
    await instance.createContract(buyer, energyAmount, price, duration, {
      from: seller,
    });

    const transaction = await instance.getTransaction(1);
    // log the transaction
    console.log(transaction);
    console.log(transaction[7]);

    assert.equal(transaction[1], buyer, "Buyer is incorrect");
    assert.equal(transaction[2], seller, "Seller is incorrect");
    assert.equal(
      transaction[3].toNumber(),
      energyAmount,
      "Energy amount is incorrect"
    );
    assert.equal(transaction[4].toString(), price, "Price is incorrect");
    assert.equal(
      transaction[7],
      false,
      "Transaction should not be completed yet"
    );

    // Call the completeTransaction function from the buyer's account
    await instance.completeTransaction(1, { from: buyer, value: price });

    const completedTransaction = await instance.getTransaction(1);

    assert.equal(
      completedTransaction[7],
      true,
      "Transaction should be completed"
    );
  });
});
