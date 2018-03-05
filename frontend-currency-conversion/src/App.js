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
  createOptions = (type) => {
    const options = this.state.currencies.map((currency, i) =>
      <option key={i} value={currency}>
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
    // And then GET the appropriate USD rate for the Destination currency
    this.setState({
      to: selected,
      showResult: false
    }, this.getRate);
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

  // Get the rate for the current conversion and the rate in USD
  getRates = () => {
    this.getRate();
    this.getRateUSD();
  }

  // Get the USD rate based on the destination currency
  getRateUSD = () => {
    const currency = this.state.from;
    console.log(">>> Getting USD Rate for:", currency);
    console.log(`http://localhost:3000/convert/${currency}/USD`);
    // If the FROM currency is USD then the rate is 1 because
    // the USD rate calculation is based on the FROM currency
    if (currency === "USD") {
      console.log("USD to USD = rate 1");
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

  // Updating the amount the user entered
  updateAmount = e => {
    console.log(">>> STARTING: updateAmount");
    const value = e.target.value;
    const re = / |,/gi;
    const amount = Number(value.replace(re, ""));
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
    const amount = Number(this.state.amount);
    console.log("amount:", amount);
    const rateUSD = this.state.rateUSD;
    console.log("rateUSD:", rateUSD);
    const amountUSD = amount * rateUSD;
    console.log("amountUSD:", amountUSD);
    console.log("amountUSD:", amountUSD);
    console.log("amountUSD:", amountUSD);
    console.log("amountUSD:", amountUSD);
    console.log("amountUSD:", amountUSD);
    console.log(typeof amountUSD);
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
    const amount = this.state.amount;
    if (!amount || amount < 0) {
      console.log("<<< INVALID INPUT! >>>");
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

  swapCurrency = () => {
    const from = this.state.from;
    const to = this.state.to;

    const optionsFrom = document.querySelectorAll(".from option");
    const optionsTo = document.querySelectorAll(".to option");

    console.log("FROM:", from);
    console.log("TO:", to);

    optionsFrom.forEach(optionFrom => {
      if (optionFrom.textContent === to) {
        console.log("SELECTING:\n", optionFrom);
        optionFrom.setAttribute("selected", true);
      } else {
        optionFrom.removeAttribute("selected");
      }
    });

    optionsTo.forEach(optionTo => {
      if (optionTo.textContent === from) {
        console.log("SELECTING:\n", optionTo);
        optionTo.setAttribute("selected", true);
      } else {
        optionTo.removeAttribute("selected");
      }
    });

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
