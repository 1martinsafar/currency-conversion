import React, { Component } from 'react';
import './styles.css';

import axios from 'axios';

class App extends Component {

  state = {
    amount: 0,
    from: "",
    to: "",
    result: 0,
    rate: 1,
    currencies: []
  }

  // Using custom API to get a list of available currencies
  // and settings the default from/to values
  componentWillMount() {
    axios.get(`http://localhost:3000/stats/currencies`)
      .then(res => {
        const currencies = res.data.currencies;
        this.setState({
          from: currencies[0],
          to: currencies[0],
          currencies: currencies
        });
        console.log("FINISHED: component WILL MOUNT");
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  // Creating the list of available currency options
  createOptions = () => {
    const options = this.state.currencies.map((currency, i) =>
      <option key={i} value={"option" + i}>
        {currency}
      </option>);
    return options;
  }

  // LATER: DRY -> use 1 function

  // handleCurrencyChange = (type, e) => {
  //   const selected = e.target.options[e.target.selectedIndex].text;
  //   this.setState({ [type]: selected });
  // }

  // Retrieving user's FROM currency
  handleFromChange = e => {
    console.log(">>> STARTING: handleFromChange");
    const selected = e.target.options[e.target.selectedIndex].text;
    // Calculate the result whenever the `FROM` currency changes
    this.setState({ from: selected }, this.getRate);
  }

  // Retrieving user's TO currency
  handleToChange = e => {
    console.log(">>> STARTING: handleToChange");
    const selected = e.target.options[e.target.selectedIndex].text;
    // Calculate the result whenever the `TO` currency changes
    this.setState({ to: selected }, this.getRate);
  }

  // Calculating the result of the current conversion
  getRate = () => {
    const from = this.state.from;
    const to = this.state.to;
    axios.get(`http://localhost:3000/convert/${from}/${to}`)
    .then(res => {
      const rate = res.data.rate;
      const amount = this.state.amount;

      if (rate) {
        let result = amount * rate;
        console.log("RESULT:", result);
        this.setState({
          rate,
          result
        });
      }
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
    });
  }

  // Updating the amount the user entered
  updateAmount = e => {
    console.log(">>> STARTING: updateAmount");
    const amount = Number(e.target.value);
    // Calculate the result whenever the `AMOUNT` to convert changes
    this.setState({
      amount
    }, this.getRate);
  }

  render() {
    const options = this.createOptions();

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
              <select className="from" onChange={this.handleFromChange}>
                {options}
              </select>
            </div>

            <div className="col-2">To:</div>
            <div className="col-4">
              <select className="to" onChange={this.handleToChange}>
                {options}
              </select>
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
            <span className="result">Result: {this.state.result}</span>
          </div>

        </div>

      </div>
    );
  }
}

export default App;
