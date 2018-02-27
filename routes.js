// a module to handle the routes for stats
"use strict";

const express = require("express");
const router = express.Router();

const fs = require("fs");
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);
console.log(stats);

// 1.
// GET the Most popular destination currency
router.get("/popular", (req, res) => {
  console.log(">>> Getting MOST POPULAR DESTINATION.");
  const destinations = stats.mostPopular;
  let reply;
  let count = 0;
  let index = 0;

  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i]["conversions"] > count) {
      count = destinations[i]["conversions"];
      index = i;
    }
  }
  res.send(destinations[index]["currency"]);
  // let reply;
  // if (stats.mostPopular.length > 0) {
  //   res.json(stats.mostPopular[0]);
  // } else {
  //   res.json(stats.mostPopular);
  // }
});

// POST
router.post("/popular/:name", (req, res) => {
  const name = req.params.name;
  const destinations = stats["mostPopular"];
  let present = false;
  for (let i = 0; i < destinations.length; i++) {
    console.log("UPDATING:", name);
    console.log("CHECKING:", destinations[i].currency);
    console.log("EQUALS:", destinations[i].currency === name);
    if (destinations[i].currency === name) {
      destinations[i].conversions += 1;
      present = true;
      break;
    }
  }
  if (!present) {
    const newDestination = {
      "currency": name,
      "conversions": 1
    };
    destinations.push(newDestination);
  }
  let reply;
  const data = JSON.stringify(stats, null, 2);
  fs.writeFile("stats.json", data, err => {
    if (err) {
      throw err;
    } else {
      reply = {
        msg: "Popular destinations updated",
        destinations: stats.mostPopular
      };
    }
  });
  console.log(">>> DONE updating the MOST POPULAR DESTINATIONS");
  res.json(reply);
});

// 2. Total amount converted (in USD)
// GET
router.get("/amount", (req, res) => {
  console.log(">>> Getting TOTAL AMOUNT.");
  res.json(stats.amountConverted);
});
// PUT
router.put("/amount/:number", (req, res) => {
  console.log(">>> Updating TOTAL AMOUNT.");
  console.log("BEFORE: ", stats["amountConverted"]);
  const amount = Number(req.params.number);

  let reply;

  if (!amount) {
    reply = {
      msg: "An amount is required."
    }
  response.send(reply);
  } else {
    stats["amountConverted"] += amount;
    const data = JSON.stringify(stats, null, 2);
    fs.writeFile("stats.json", data, err => {
      if (err) {
        throw err;
      } else {
        reply = {
          amountAdded: amount
        }
        console.log("The AMOUNT has been updated.");
        console.log("AFTER: ", stats["amountConverted"]);
      }
      res.send(reply);
    });
  }
});

// 3. Total number of conversion requests made
// GET
router.get("/conversions", (req, res) => {
  console.log(">>> Getting NUMBER OF CONVERSIONS.");
  res.json(stats.requestsNumber);
});
// PUT
router.put("/conversions", (req, res) => {
  console.log(">>> Updating TOTAL AMOUNT +1.");
  console.log("BEFORE: ", stats["requestsNumber"]);
  stats["requestsNumber"] += 1;
  let reply;
  const data = JSON.stringify(stats, null, 2);
  fs.writeFile("stats.json", data, err => {
    if (err) {
      throw err;
    } else {
      reply = {
        msg: "The number of requests has been increased by 1.",
        requestsNumber: stats["requestsNumber"]
      }
      res.send(reply);
    }
  });
});

module.exports = router;




//
