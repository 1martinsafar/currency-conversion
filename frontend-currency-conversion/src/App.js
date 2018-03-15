import React, { Component } from "react";
import "./styles.css";

import axios from "axios";

// Components
import Stats from "./Components/Stats";
import Options from "./Components/Options";
import Amount from "./Components/Amount";
import Result from "./Components/Result";
import Swap from "./Components/Swap";

class App extends Component {

  // Setting the default state
  state = {
    amount: 0,
    from: "",
    to: "",
    result: 0,
    rate: 1,
    currencies: [],
    mostPopular: "",
    totalAmount: 0,
    conversions: 0,
    rateUSD: null,
    showResult: false,
  }

  // Using custom API to get a list of available currencies
  // and settings the default from/to values
  componentDidMount() {
    // GET list of currencies, set the default currency and get its USD rate
    this.getCurrencies();
    // GET the most popular currency destination
    this.getMostPopular();
    // GET the total amount converted (in USD)
    this.getTotalConverted();
    // GET the total number of conversion requests made
    this.getTotalRequests();
    console.log("FINISHED: Component DID MOUNT TEST");
  } // end of componentDidMount //

  //
  // DATA FETCHING FUNCTIONS
  //

  getCurrencies = () => {
    // GET list of currencies, set the default currency and get its USD rate
    axios.get(`http://localhost:3000/stats/currencies`)
      .then(res => {
        console.log("FETCHING currencies");
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
  }

  getMostPopular = () => {
    // GET the most popular currency destination
    axios.get(`http://localhost:3000/stats/popular`)
      .then(res => {
        console.log("FETCHING most popular");
        const mostPopular = res.data;
        console.log("NOW: most popular:", mostPopular);
        this.setState({
          mostPopular
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  getTotalConverted = () => {
    // GET the total amount converted (in USD)
    axios.get(`http://localhost:3000/stats/amount`)
      .then(res => {
        console.log("FETCHING total amount");
        const totalAmount = Math.round(res.data);
        console.log("NOW: total Amount:", totalAmount);
        this.setState({
          totalAmount
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  getTotalRequests = () => {
    // GET the total number of conversion requests made
    axios.get(`http://localhost:3000/stats/conversions`)
      .then(res => {
        console.log("FETCHING total requests");
        const conversions = res.data;
        console.log("NOW: total conversions:", conversions);
        this.setState({
          conversions
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  //
  // DATA SAVING FUNCTIONS
  //

  // Update the popularity of currency destinations
  saveDestination = () => {
    console.log(">>> SAVING: Destination");
    const destination = this.state.to;
    // PUT to stats/popular/:destination
    axios.post(`http://localhost:3000/stats/popular/${destination}`)
    .then(res => {
      console.log("SAVED DESTINATION");
      console.log(res.data);
      this.getMostPopular();
    })
    .catch(error => {
      console.log('Error updating data', error);
    });
  }

  // Save the converted amount in USD
  saveAmount = () => {
    console.log(">>> SAVING: Amount in USD");
    const amount = Number(this.state.amount);
    const rateUSD = this.state.rateUSD;
    const amountUSD = amount * rateUSD;
    // PUT to the stats/amount/:number
    axios.put(`http://localhost:3000/stats/amount/${amountUSD}`)
    .then(res => {
      console.log("SAVED converted amount in USD");
      console.log(res.data);
      const totalAmount = Math.round(res.data.total);
      this.setState({totalAmount});
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
      const conversions = res.data.requestsNumber;
      this.setState({conversions});
    })
    .catch(error => {
      console.log('Error updating data', error);
    });
  }

  //
  // APP FUNCTIONS
  //

  // Creating the list of available currency options
  createOptions = () => {
    const options = this.state.currencies.map((currency, i) =>
      <option key={i} value={currency}>
        {currency}
      </option>);
    return options;
  }

  // Retrieving user's specified currency
  handleCurrencyChange = (type, callback, e) => {
    const selected = e.target.options[e.target.selectedIndex].text;
    this.setState({
      [type]: selected,
      showResult: false
    }, callback);
  }

  // Retrieving user's FROM currency
  handleFromChange = e => {
    console.log(">>> Handling FROM change");
    // Calculate the currency rate and USD rate whenever the `FROM` currency changes
    this.handleCurrencyChange("from", this.getRates, e);
  }

  // Retrieving user's TO currency
  handleToChange = e => {
    console.log(">>> Handling TO change");
    // Calculate the currency rate whenever the `TO` currency changes
    this.handleCurrencyChange("to", this.getRate, e);
  }

  // Calculating the rate of the current conversion
  getRate = () => {
    console.log(">>> Getting rate");
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

  // Get the USD rate based on the destination currency
  getRateUSD = () => {
    console.log(">>> Getting USD rate");
    const currency = this.state.from;
    // If the FROM currency is USD then the rate is 1 because
    // the USD rate calculation is based on the FROM currency
    if (currency === "USD") {
      const rateUSD = 1;
      this.setState({
        rateUSD
      });
      return;
    }
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

  // Get the rates for the current conversion and the USD rate
  getRates = () => {
    console.log(">>> Getting rates");
    this.getRate();
    this.getRateUSD();
  }

  // Updating the amount the user entered, spaces and commas allowed
  updateAmount = e => {
    console.log(">>> Updating amount");
    const value = e.target.value;
    const re = / |,/gi;
    const amount = Number(value.replace(re, ""));
    this.setState({
      amount
    });
  }

  // Perform the currency conversion and save the data to the database
  convert = () => {
    console.log(">>> Converting");
    const amount = this.state.amount;
    if (!amount || amount < 0) {
      this.setState({
        result: 0,
        showResult: true
      });
      return;
    }
    else if (this.state.from === this.state.to) {
      this.setState({
        result: this.state.amount,
        showResult: true
      });
      return;
    }
    this.saveDestination();
    this.saveAmount();
    this.saveRequest();
    const rate = this.state.rate;
    const result = amount * rate;
    this.setState({
      result,
      showResult: true
    });
  }

  // Selects the specified currency in the list of options
  selectOption = (options, currency) => {
    options.forEach(option => {
      if (option.textContent === currency) {
        option.setAttribute("selected", true);
      } else {
        option.removeAttribute("selected");
      }
    });
  }

  // Swaps the currencies by adding `selected` attribute to the appropriate dropdown
  swapCurrency = () => {
    console.log(">>> Swapping currencies");
    const from = this.state.from;
    const to = this.state.to;
    const optionsFrom = document.querySelectorAll(".from option");
    const optionsTo = document.querySelectorAll(".to option");

    this.selectOption(optionsFrom, to);
    this.selectOption(optionsTo, from);
    // Updating the currencies and currency rates
    this.setState({
      from: to,
      to: from,
      showResult: false
    }, this.getRates);
  }

  render() {
    const optionsFrom = this.createOptions("from");
    const optionsTo = this.createOptions("to");

    const showResult = this.state.result > 0 && this.state.showResult;

    const num = this.state.result;
    const re = /,/gi;
    const result = num.toLocaleString(undefined, {maximumFractionDigits: 2}).replace(re, " ");

    return (
      <div className="container-fluid wrapper">
        <div className="container content">

          <h1 className="title">Currency Conversion</h1>

          <Stats title="Popular destination" data={this.state.mostPopular} />
          <Stats title="Amount converted" data={"$" + this.state.totalAmount} />
          <Stats title="Total requests" data={this.state.conversions} />

          <div className="options-container">
            <Options type="FROM" options={optionsFrom} value={this.state.from} handleChange={this.handleFromChange} />
            <Swap handleSwap={this.swapCurrency} />
            <Options id="currency-to" type="TO" options={optionsTo} value={this.state.to} handleChange={this.handleToChange} />
          </div>

          <Amount updateAmount={this.updateAmount} />

          <Result convert={this.convert} showResult={showResult} result={result} currency={this.state.to} />

        </div>
      </div>
    );
  }
}

export default App;
