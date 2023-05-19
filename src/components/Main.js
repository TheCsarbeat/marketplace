import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content">
        <h1>Crear Contrato</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const energyAmount = this.energyAmount.value;
            const price = this.price.value;
            const duration = this.duration.value;
            this.props.createEnergyContract(energyAmount, price, duration);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="energyAmount"
              type="text"
              ref={(input) => {
                this.energyAmount = input;
              }}
              className="form-control"
              placeholder="Cantidad de Energia en kWh"
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
              placeholder="Precio en ETH (Wei)"
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
              placeholder="Duracion en dias"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Contrato
          </button>
        </form>
        <p>&nbsp;</p>
        <h2>Contratos de Energia</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Comprador</th>
              <th scope="col">Vendedor</th>
              <th scope="col">Cantidad de energia en kWh</th>
              <th scope="col">Precio en ETH</th>
              <th scope="col">Fecha de Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Completado</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="energyContractList">
            {this.props.energyContracts.map((energyContract, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{energyContract[0].toString()}</th>
                  <td>{energyContract[1]}</td>
                  <td>{energyContract[2]}</td>
                  <td>{energyContract[3].toString()}</td>
                  <td>{energyContract[4].toString()}</td>
                  <td>
                    {new Date(
                      energyContract[5].toNumber() * 1000
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      energyContract[6].toNumber() * 1000
                    ).toLocaleString()}
                  </td>
                  <td>{energyContract[7] ? "Yes" : "No"}</td>
                  <td>
                    {!energyContract[7] ? (
                      <button
                        name={energyContract[0]}
                        value={energyContract[4].toString()}
                        onClick={(event) => {
                          this.props.completeEnergyContract(
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
