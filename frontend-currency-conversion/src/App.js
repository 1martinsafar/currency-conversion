import React, { Component } from 'react';
import './styles.css';

import axios from 'axios';

class App extends Component {

  state = {
    currencies: [],
    amount: -1,
    from: "",
    to: ""
  }

  componentDidMount() {
    axios.get(`localhost:3000/stats/currencies`)
      .then(res => {
        const currencies = res.data;
        this.setState({ currencies });
      })
  }

  loadCurrencies = () => {

  }
  updateAmount = e => {
    console.log("Updating:");
    this.setState({
      amount: Number(e.target.value)
    });
  }

  render() {
    return (
      <div className="container-fluid wrapper">

        <div className="container content">

          <h1>Currency Conversion App</h1>
          <h2>Most popular destination currency: </h2>
          <h2>Total amount converted (in USD): </h2>
          <h2>Total number of conversion requests made: </h2>

          <div className="row">
            <div className="col-2">From:</div>
            <div className="col-4">
              <select className="from"></select>
            </div>

            <div className="col-2">To:</div>
            <div className="col-4">
              <select className="to"></select>
            </div>
          </div>

          <p>
            amount:
            <input type="text"
                   name="amount"
                   placeholder="amount"
                   onChange={this.updateAmount}
                   required />
          </p>

          <div className="row">
            Result: <span className="result"></span>
          </div>

        </div>

      </div>
    );
  }
}

export default App;
