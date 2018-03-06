// a module to handle the routes for performing conversions
"use strict";

const express = require("express");
const router = express.Router();

const axios = require("axios");

/*
SAMPLE EXTERNAL API RESPONSE

http://api.fixer.io/latest?base=USD&symbols=GBP
{
base: "USD",
date: "2018-02-27",
rates: { GBP: 0.71864 }
}
*/

// Using EXTERNAL API for the Conversion Rates
// returns a promise with the conversion results
const getRate = (from, to) => {
  console.log("Fetching the currency conversion rate from an external API.");
  let results = axios.get(`http://api.fixer.io/latest?base=${from}&symbols=${to}`)
  .then( response => {
    return response.data;
  })
  .catch( err => {
    console.log("Error - invalid currency/ies!");
    return 0;
  });
  return results;
};

// GET /convert/:from/:to
// Getting the final conversion rate for the searched currency
router.get("/:from/:to", (req, res) => {
  const from = req.params.from.toUpperCase();
  const to = req.params.to.toUpperCase();
  getRate(from, to)
  .then( response => {
    if (!response || !respons.rates[to]) {
      console.log("Error - invalid currency/ies!");
      return res.json({ "error": "invalid currency/ies!" });
    }
    const rate = response.rates[to];
    console.log("rate:", rate);
    const reply = {
      "msg": "Conversion completed!",
      "from": from,
      "to": to,
      "results": response,
      "rate": rate
    };
    res.json(reply);
  })
  .catch( err => {
    console.log(err);
  });
});

module.exports = router;




//
