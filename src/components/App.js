import React, { Component } from "react";
import Web3 from "web3";
import logo from "../logo.png";
import "./App.css";
import RenewableEnergyExchange from "../abis/RenewableEnergyExchange.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        // User denied account access
        console.log("Authorization denied:", error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = RenewableEnergyExchange.networks[networkId];
    if (networkData) {
      const renewableEnergyExchange = new web3.eth.Contract(
        RenewableEnergyExchange.abi,
        networkData.address
      );
      this.setState({ renewableEnergyExchange });
      const energyContractCount = await renewableEnergyExchange.methods
        .energyContractCount()
        .call();
      this.setState({ energyContractCount });
      // Load energyContracts
      for (var i = 1; i <= energyContractCount; i++) {
        const energyContract = await renewableEnergyExchange.methods
          .getEnergyContract(i)
          .call();
        this.setState({
          energyContracts: [...this.state.energyContracts, energyContract],
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert(
        "RenewableEnergyExchange contract not deployed to detected network."
      );
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      energyContractCount: 0,
      energyContracts: [],
      loading: true,
    };

    this.createEnergyContract = this.createEnergyContract.bind(this);
    this.completeEnergyContract = this.completeEnergyContract.bind(this);
  }

  createEnergyContract(energyAmount, price, duration) {
    // duration from days to seconds
    duration = duration * 86400;
    this.setState({ loading: true });
    this.state.renewableEnergyExchange.methods
      .createEnergyContract(energyAmount, price, duration)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  completeEnergyContract(energyContractId, price) {
    this.setState({ loading: true });
    this.state.renewableEnergyExchange.methods
      .completeEnergyContract(energyContractId)
      .send({ from: this.state.account, value: price })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <Main
                  energyContracts={this.state.energyContracts}
                  createEnergyContract={this.createEnergyContract}
                  completeEnergyContract={this.completeEnergyContract}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
