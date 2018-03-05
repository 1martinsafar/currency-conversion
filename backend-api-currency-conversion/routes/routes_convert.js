// a module to handle the routes for calculating conversions
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
  let results = axios.get(`http://api.fixer.io/latest?base=${from}&symbols=${to}`)
  .then( response => {
    return response.data;
  })
  .catch( err => {
    console.log(err);
  });
  return results;
};

// GET - get the final conversion rate for the searched currency
// maybe respond with only the rate later
router.get("/:from/:to", (req, res) => {
  const from = req.params.from.toUpperCase();
  const to = req.params.to.toUpperCase();
  getRate(from, to)
  .then( response => {
    console.log("__results:", response);
    const rate = response.rates[to];
    const reply = {
      "msg": "Conversion completed!",
      "from": from,
      "to": to,
      "results": response,
      "rate": rate
    };
    res.send(reply);
  })
  .catch( err => {
    console.log(err);
  });
});

module.exports = router;




//
