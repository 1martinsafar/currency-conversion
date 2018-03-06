// a module to handle the routes for displaying stats
"use strict";

const express = require("express");
const router = express.Router();

const fs = require("fs");
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);
console.log(stats);

// For fetching data from an external API
const axios = require("axios");

// 1.
// GET /stats/popular
// Route for getting the Most popular destination currency
router.get("/popular", (req, res) => {
  console.log(">>> Getting: Most popular destination.");
  const destinations = stats.mostPopular;
  if (destinations.length < 1) {
    console.log("No currency has been used yet.");
    return res.json("");
  }
  let count = 0;
  let index = 0;
  // Index will match the destination with the highest number
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i]["conversions"] > count) {
      count = destinations[i]["conversions"];
      index = i;
    }
  }
  res.json(destinations[index]["currency"]);
});

// POST /stats/popular/:name
// Route for updating the list of popular destinations
router.post("/popular/:name", (req, res) => {
  console.log(">>> Updating: popular destinations.");
  const name = req.params.name.toLowerCase();
  const destinations = stats["mostPopular"];
  let present = false;
  for (let i = 0; i < destinations.length; i++) {
    console.log("Updating curency:", name);
    // If the currency is in the list, increase the popularity by 1
    if (destinations[i].currency === name) {
      destinations[i].conversions += 1;
      present = true;
      break;
    }
  }
  // If the currency hasn't been used, add it to the list
  if (!present) {
    const newDestination = {
      "currency": name,
      "conversions": 1
    };
    destinations.push(newDestination);
  }
  // Formatting the stats.json file to be easy to read
  const data = JSON.stringify(stats, null, 2);
  fs.writeFile("stats.json", data, err => {
    if (err) {
      //throw "Error writing to the most popular currencies!";
    }
  });
  let reply = {
    msg: "Popular destinations updated",
    destinations: stats.mostPopular
  };
  res.json(reply);
});

// 2.
// GET /stats/amount
// Route for getting the total amount converted (in USD)
router.get("/amount", (req, res) => {
  console.log(">>> Getting: Total amount.");
  res.json(stats.amountConverted);
});

// PUT /stats/amount/:number
// Route for updating the total amount converted by the searched value
router.put("/amount/:number", (req, res) => {
  console.log(">>> Updating: Total amount.");
  const amount = Number(req.params.number);
  console.log(amount);
  if (amount < 0 || Number.isNaN(amount)) {
    console.log("Invalid amount entered!");
    return res.json({ "error": "Invalid amount entered!"});
  }
  let reply;

  stats["amountConverted"] += amount;
  // Formatting the stats.json file to be easy to read
  const data = JSON.stringify(stats, null, 2);
  fs.writeFile("stats.json", data, err => {
    if (err) {
      //throw "Error writing to the amount converted!";
    } else {
      reply = {
        amountAdded: amount,
        total: stats["amountConverted"]
      }
    }
    res.json(reply);
  });
});

// 3.
// GET /stats/conversions
// Route for getting the total number of conversion requests made
router.get("/conversions", (req, res) => {
  console.log(">>> Getting: Number of conversions.");
  res.json(stats.requestsNumber);
});

// PUT /stats/conversions
// Route for updating the number of conversion requests for the searched currency
router.put("/conversions", (req, res) => {
  console.log(">>> Updating: Number of conversions +1.");
  stats["requestsNumber"] += 1;
  let reply;
  const data = JSON.stringify(stats, null, 2);
  fs.writeFile("stats.json", data, err => {
    if (err) {
      //throw "Error writing to the requests number!";
    } else {
      reply = {
        msg: "The number of requests has been increased by 1.",
        requestsNumber: stats["requestsNumber"]
      }
      res.json(reply);
    }
  });
});

// GET Currency Options from an external API
const getCurrencies = () => {
  console.log("Fetching the available currencies from an external API.");
  const results = axios.get(`http://api.fixer.io/latest`)
  .then( response => {
    return response.data;
  })
  .catch( err => {
    console.log(err);
    //throw "Error accessing external API's currency options!";
  })
  return results;
};

// 4.
// GET /stats/currencies
// Route for getting a list of names of all the available currencies
router.get("/currencies", (req, res) => {
  console.log(">>> Getting: All available currency names.");
  getCurrencies()
  .then( response => {
    const currencies = Object.keys(response.rates);
    const reply = {
      "msg": "Available currencies",
      "currencies": currencies
    };
    res.json(reply);
  })
  .catch( err => {
    console.log(err);
    //throw "Error accessing external API's currency options!";
  })
});

module.exports = router;




//
