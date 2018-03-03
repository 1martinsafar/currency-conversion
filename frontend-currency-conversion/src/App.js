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
    currencies: [],
    mostPopular: null,
    totalAmount: null,
    conversions: null,
    rateUSD: null,
    showResult: false
  }

  // Using custom API to get a list of available currencies
  // and settings the default from/to values
  componentWillMount() {
    // GET list of currencies
    axios.get(`http://localhost:3000/stats/currencies`)
      .then(res => {
        const currencies = res.data.currencies;
        this.setState({
          from: currencies[0],
          to: currencies[0],
          currencies: currencies
        }, this.getRateUSD);
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
    // GET the most popular currency destination
    axios.get(`http://localhost:3000/stats/popular`)
      .then(res => {
        console.log("FETCHING MOST POPULAR");
        const mostPopular = res.data;
        this.setState({
          mostPopular
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
    // GET the total amount converted (in USD)
    axios.get(`http://localhost:3000/stats/amount`)
      .then(res => {
        console.log("FETCHING TOTAL AMOUNT");
        const totalAmount = Math.round(res.data);
        this.setState({
          totalAmount
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
      // GET the total number of conversion requests made
      axios.get(`http://localhost:3000/stats/conversions`)
        .then(res => {
          console.log("FETCHING TOTAL AMOUNT");
          const conversions = res.data;
          this.setState({
            conversions
          });
        })
        .catch(error => {
          console.log('Error fetching and parsing data', error);
        });

    console.log("FINISHED: component WILL MOUNT");
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
    this.setState({
      from: selected,
      showResult: false
    }, this.getRates);
  }

  // Retrieving user's TO currency
  handleToChange = e => {
    console.log(">>> STARTING: handleToChange");
    const selected = e.target.options[e.target.selectedIndex].text;
    // Calculate the result whenever the `TO` currency changes
    this.setState({
      to: selected,
      showResult: false
    }, this.getRate);

    // GET the appropriate USD rate for the Destination currency
    // this.getRateUSD();
  }

  // Calculating the result of the current conversion
  getRate = () => {
    console.log(">>> STARTING: getRate");
    const from = this.state.from;
    const to = this.state.to;
    axios.get(`http://localhost:3000/convert/${from}/${to}`)
    .then(res => {
      const rate = res.data.rate;
      this.setState({
        rate
      });
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
    });
  }

  // TESTING -> a callback calling 2 functions
  getRates = () => {
    this.getRate();
    this.getRateUSD();
  }

  // Get the USD rate based on the destination currency
  getRateUSD = () => {
    const currency = this.state.from;
    console.log(">>> Getting USD Rate for:", currency);
    console.log(`http://localhost:3000/convert/${currency}/USD`);
    axios.get(`http://localhost:3000/convert/${currency}/USD`)
      .then(res => {
        console.log("FETCHING USD RATE");
        const rateUSD = res.data.rate;
        console.log("rateUSD:", rateUSD);
        this.setState({
          rateUSD
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  // Updating the amount the user entered
  updateAmount_WITH_CALLBACK = e => {
    console.log(">>> STARTING: updateAmount");
    const amount = Number(e.target.value);
    // Calculate the result whenever the `AMOUNT` to convert changes
    this.setState({
      amount
    }, this.getRate);
  }

  // Updating the amount the user entered
  updateAmount = e => {
    console.log(">>> STARTING: updateAmount");
    const amount = Number(e.target.value);
    // Calculate the result whenever the `AMOUNT` to convert changes
    this.setState({
      amount
    });
  }

  // Update the popularity of currency destinations
  saveDestination = () => {
    console.log(">>> SAVING: Destination");
    const destination = this.state.to;
    console.log("Destination:", destination);
    // PUT to stats/popular/:destination
    axios.post(`http://localhost:3000/stats/popular/${destination}`)
    .then(res => {
      console.log("SAVED DESTINATION");
      console.log(res.data);
    })
    .catch(error => {
      console.log('Error updating data', error);
    });
  }

  // Save the converted amount in USD
  saveAmount = () => {
    console.log(">>> SAVING: Amount in USD");
    const amount = this.state.amount;
    const rateUSD = this.state.rateUSD;
    const amountUSD = amount * rateUSD;
    console.log("amountUSD:", amountUSD);
    // PUT to the amountConverted
    axios.put(`http://localhost:3000/stats/amount/${amountUSD}`)
    .then(res => {
      console.log("SAVED converted amount in USD");
      console.log(res.data);
    })
    .catch(error => {
      console.log('Error updating data', error);
    });
  }

  // Increase the number of total conversion requests made on the web page by 1
  saveRequest = () => {
    console.log(">>> SAVING: Request");
    // PUT to stats/conversions
    axios.put(`http://localhost:3000/stats/conversions`)
    .then(res => {
      console.log("SAVED REQUEST");
      console.log(res.data);
    })
    .catch(error => {
      console.log('Error updating data', error);
    });
  }

  convert = () => {
    console.log(">>> CONVERTING");
    // DONE
    // this.saveDestination();
    // DONE
    // this.saveAmount();
    // DONE
    // this.saveRequest();
    const rate = this.state.rate;
    const amount = this.state.amount;
    const result = amount * rate;
    console.log("RESULT:", result);
    this.setState({
      result,
      showResult: true
    });
  }

  render() {
    const options = this.createOptions();
    const showResult = this.state.result > 0 && this.state.showResult;

    return (
      <div className="container-fluid wrapper">

        <div className="container content">

          <h1 className="title">Currency Conversion</h1>

          <div className="stats-container">
            <h2 className="stats">Popular destination:</h2>
            <span className="data">{this.state.mostPopular}</span>
          </div>
          <div className="stats-container">
            <h2 className="stats">Amount converted:</h2>
            <span className="data">${this.state.totalAmount}</span>
          </div>
          <div className="stats-container">
            <h2 className="stats">Total requests:</h2>
            <span className="data">{this.state.conversions}</span>
          </div>

          <div className="options-container">
            <div className="currency-container">
              <div className="currency">FROM:</div>
              <div className="options">
                <select className="from" onChange={this.handleFromChange}>
                  {options}
                </select>
              </div>
            </div>

            <div className="currency-container">
              <div className="currency">TO:</div>
              <div className="options">
                <select className="to" onChange={this.handleToChange}>
                  {options}
                </select>
              </div>
            </div>
          </div>

          <div className="amount-container">
            <h2 className="amount">amount:</h2>
            <input type="text"
                   name="amount"
                   className="input"
                   onChange={this.updateAmount}
                   required />
          </div>

          <div className="result-container">
            <button name="convert" className="convert" onClick={this.convert}>Convert</button>
            <span className="result">
              Result: {showResult ? <span>{this.state.result.toFixed(2)}</span> : null} {showResult ? this.state.to : null}
            </span>
          </div>

        </div>

      </div>
    );
  }
}

export default App;
