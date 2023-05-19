import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content">
        <h1>Create Contract</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const buyer = this.buyer.value;
            const energyAmount = this.energyAmount.value;
            const price = this.price.value;
            const duration = this.duration.value;
            this.props.createContract(buyer, energyAmount, price, duration);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="buyer"
              type="text"
              ref={(input) => {
                this.buyer = input;
              }}
              className="form-control"
              placeholder="Buyer Address"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="energyAmount"
              type="text"
              ref={(input) => {
                this.energyAmount = input;
              }}
              className="form-control"
              placeholder="Energy Amount"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => {
                this.price = input;
              }}
              className="form-control"
              placeholder="Price"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="duration"
              type="text"
              ref={(input) => {
                this.duration = input;
              }}
              className="form-control"
              placeholder="Duration"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Contract
          </button>
        </form>
        <p>&nbsp;</p>
        <h2>Transactions</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Buyer</th>
              <th scope="col">Seller</th>
              <th scope="col">Energy Amount</th>
              <th scope="col">Price</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Completed</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="transactionList">
            {this.props.transactions.map((transaction, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{transaction[0].toString()}</th>
                  <td>{transaction[1]}</td>
                  <td>{transaction[2]}</td>
                  <td>{transaction[3].toString()}</td>
                  <td>{transaction[4].toString()}</td>
                  <td>
                    {new Date(
                      transaction[5].toNumber() * 1000
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      transaction[6].toNumber() * 1000
                    ).toLocaleString()}
                  </td>
                  <td>{transaction[7] ? "Yes" : "No"}</td>
                  <td>
                    {!transaction[7] ? (
                      <button
                        name={transaction[0]}
                        value={transaction[4].toString()}
                        onClick={(event) => {
                          this.props.completeTransaction(
                            event.target.name,
                            event.target.value
                          );
                        }}
                      >
                        Complete
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
